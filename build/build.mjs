/* =====================================================================
   VYD Design System — build/build.mjs
   Single source of truth: /tokens/tokens.json (+ /tokens/tokens.light.json).
   Engine: Style Dictionary (parse + reference resolution). Rendering is done
   by thin custom formats so the legacy `--vyd-*` contract is preserved exactly.

   Outputs (all in /dist):
     theme.css            variables (3 theme blocks) + primitive component classes
     variables.css        variables only (no opinionated classes)
     tokens.tailwind.js   Tailwind preset (theme.extend), values = var() refs
     tokens.js / .mjs     token object (CJS + ESM), leaves = var() refs
     tokens.d.ts          types for the token object
     tokens.resolved.json fully-resolved values (hex/px) for tooling/design

   Run: npm run build
   Env: VYD_ROOT overrides the repo root; VYD_DIST overrides the output dir.
   ===================================================================== */

import StyleDictionary from 'style-dictionary';
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import {
  kebab, vydName, cssValue, isSemantic, renderBlock,
} from './lib.mjs';

const ROOT = process.env.VYD_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
const TOKENS = join(ROOT, 'tokens');
const DIST = process.env.VYD_DIST || join(ROOT, 'dist');
// Scratch dirs live on the local tmp fs (some mounts forbid unlink): the build
// only ever CREATES/OVERWRITES files inside the repo, never deletes them there.
const CLEAN = join(tmpdir(), 'vyd-clean');
const PARTS = join(tmpdir(), 'vyd-parts');

/* Web font import (kept so dist/theme.css is a drop-in replacement). */
const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');";

/* SD logs an internal "token collisions" warning because we intentionally run
   with no name transform (custom formats compute the --vyd-* names from token
   paths). The emitted files are unaffected, so silence the noise. */
const LOG = { warnings: 'disabled', verbosity: 'silent' };

/* ---------------------------------------------------------------------
   0. Strip human-only keys (_meta, _comment, $schema) into a clean copy
      so Style Dictionary sees only real tokens.
   --------------------------------------------------------------------- */
function strip(node) {
  if (Array.isArray(node)) return node.map(strip);
  if (node && typeof node === 'object') {
    const out = {};
    for (const [k, val] of Object.entries(node)) {
      if (k.startsWith('_') || k === '$schema') continue;
      out[k] = strip(val);
    }
    return out;
  }
  return node;
}
mkdirSync(CLEAN, { recursive: true });
mkdirSync(PARTS, { recursive: true });
mkdirSync(DIST, { recursive: true });
for (const f of ['tokens.json', 'tokens.light.json']) {
  const src = JSON.parse(readFileSync(join(TOKENS, f), 'utf8'));
  writeFileSync(join(CLEAN, f), JSON.stringify(strip(src), null, 2));
}

/* ---------------------------------------------------------------------
   Shared: nested token object (leaves = var() refs) for Tailwind/JS/d.ts.
   --------------------------------------------------------------------- */
function buildObject(allTokens) {
  const root = {};
  const set = (keys, val) => {
    let o = root;
    keys.slice(0, -1).forEach((k) => { o[k] = o[k] || {}; o = o[k]; });
    o[keys[keys.length - 1]] = val;
  };
  for (const t of allTokens) {
    const v = `var(--${vydName(t.path)})`;
    const p = t.path;
    if (p[0] === 'color' && p[1] === 'brand' && p[2] === 'blueprint') set(['color', 'blueprint', p[3]], v);
    else if (p[0] === 'color' && p[1] === 'neutral') set(['color', 'neutral', p[2]], v);
    else if (p[0] === 'color' && p[1] === 'semantic') set(['color', p[2], p[3]], v);
    else if (p[0] === 'typography' && p[1] === 'family') set(['font', p[2]], v);
    else if (p[0] === 'typography' && p[1] === 'size') set(['fontSize', p[2]], v);
    else if (p[0] === 'typography' && p[1] === 'weight') set(['fontWeight', p[2]], v);
    else if (p[0] === 'typography' && p[1] === 'lineHeight') set(['lineHeight', p[2]], v);
    else if (p[0] === 'typography' && p[1] === 'letterSpacing') set(['letterSpacing', p[2]], v);
    else if (p[0] === 'space') set(['space', p[1]], v);
    else if (p[0] === 'radius') set(['radius', p[1]], v);
    else if (p[0] === 'border' && p[1] === 'width') set(['borderWidth', p[2]], v);
    else if (p[0] === 'shadow') set(['shadow', p[1]], v);
    else if (p[0] === 'layout') set(['layout', vydName(t.path).replace('vyd-layout-', '')], v);
    else if (p[0] === 'motion' && p[1] === 'duration') set(['duration', p[2]], v);
    else if (p[0] === 'motion' && p[1] === 'easing') set(['easing', p[2]], v);
  }
  return root;
}

function objToType(o, indent) {
  const pad = indent || '  ';
  return Object.entries(o).map(([k, val]) => {
    const key = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
    if (typeof val === 'string') return pad + key + ': string;';
    return pad + key + ': {\n' + objToType(val, pad + '  ') + '\n' + pad + '};';
  }).join('\n');
}

/* ---------------------------------------------------------------------
   Custom formats.
   --------------------------------------------------------------------- */
const GEN = '/* GENERATED from /tokens/tokens.json - DO NOT EDIT. Run: npm run build */';

StyleDictionary.registerFormat({
  name: 'vyd/css-base',
  format: ({ dictionary }) => {
    const all = dictionary.allTokens;
    const prim = all.filter((t) => !isSemantic(t.path));
    const sem = all.filter((t) => isSemantic(t.path));
    return [
      renderBlock(':root', prim),
      '',
      renderBlock(':root,\n[data-vyd-theme="dark"]', sem),
      '',
    ].join('\n');
  },
});

StyleDictionary.registerFormat({
  name: 'vyd/css-light',
  format: ({ dictionary }) => {
    const sem = dictionary.allTokens.filter((t) => isSemantic(t.path));
    return renderBlock('[data-vyd-theme="light"]', sem) + '\n';
  },
});

StyleDictionary.registerFormat({
  name: 'vyd/tailwind',
  format: ({ dictionary }) => {
    const all = dictionary.allTokens;
    const v = (t) => 'var(--' + vydName(t.path) + ')';
    const pickMap = (pred, key) => {
      const o = {};
      for (const t of all) if (pred(t)) o[key(t)] = v(t);
      return o;
    };
    const colors = {};
    for (const t of all) {
      const p = t.path;
      if (p[0] === 'color' && p[1] === 'brand' && p[2] === 'blueprint') colors['blueprint-' + p[3]] = v(t);
      else if (p[0] === 'color' && p[1] === 'neutral') colors['neutral-' + p[2]] = v(t);
      else if (p[0] === 'color' && p[1] === 'semantic') {
        const key = p[2] === 'feedback' ? kebab(p[3]) : p[2] + '-' + kebab(p[3]);
        colors[key] = v(t);
      }
    }
    const spacing = Object.assign(
      pickMap((t) => t.path[0] === 'space', (t) => t.path[1]),
      pickMap((t) => t.path[0] === 'layout', (t) => vydName(t.path).replace('vyd-layout-', '')),
    );
    const fontFamily = {};
    for (const t of all) if (t.path[0] === 'typography' && t.path[1] === 'family') fontFamily[t.path[2]] = [v(t)];
    const preset = {
      theme: {
        extend: {
          colors,
          spacing,
          fontFamily,
          fontSize: pickMap((t) => t.path[0] === 'typography' && t.path[1] === 'size', (t) => t.path[2]),
          fontWeight: pickMap((t) => t.path[0] === 'typography' && t.path[1] === 'weight', (t) => t.path[2]),
          lineHeight: pickMap((t) => t.path[0] === 'typography' && t.path[1] === 'lineHeight', (t) => t.path[2]),
          letterSpacing: pickMap((t) => t.path[0] === 'typography' && t.path[1] === 'letterSpacing', (t) => t.path[2]),
          borderRadius: pickMap((t) => t.path[0] === 'radius', (t) => t.path[1]),
          borderWidth: pickMap((t) => t.path[0] === 'border' && t.path[1] === 'width', (t) => t.path[2]),
          boxShadow: pickMap((t) => t.path[0] === 'shadow', (t) => t.path[1]),
          transitionDuration: pickMap((t) => t.path[0] === 'motion' && t.path[1] === 'duration', (t) => t.path[2]),
          transitionTimingFunction: pickMap((t) => t.path[0] === 'motion' && t.path[1] === 'easing', (t) => t.path[2]),
        },
      },
    };
    return GEN + '\n'
      + '/* Tailwind preset. Values are CSS var() refs, so the consuming app MUST also\n'
      + '   import dist/theme.css (or variables.css) for them to resolve. Keeps runtime\n'
      + '   dark/light theming working for Tailwind utilities too. */\n'
      + 'module.exports = ' + JSON.stringify(preset, null, 2) + ';\n';
  },
});

StyleDictionary.registerFormat({
  name: 'vyd/js-cjs',
  format: ({ dictionary }) => {
    const obj = JSON.stringify(buildObject(dictionary.allTokens), null, 2);
    return GEN + '\n'
      + '/* Token object - leaves are CSS var() refs; import dist/theme.css so they resolve. */\n'
      + 'const vyd = ' + obj + ';\n'
      + 'module.exports = vyd;\nmodule.exports.vyd = vyd;\n';
  },
});

StyleDictionary.registerFormat({
  name: 'vyd/js-esm',
  format: ({ dictionary }) => {
    const obj = JSON.stringify(buildObject(dictionary.allTokens), null, 2);
    return GEN + '\n'
      + '/* Token object (ESM) - leaves are CSS var() refs; import dist/theme.css so they resolve. */\n'
      + 'const vyd = ' + obj + ';\n'
      + 'export default vyd;\nexport { vyd };\n';
  },
});

StyleDictionary.registerFormat({
  name: 'vyd/dts',
  format: ({ dictionary }) => {
    const body = objToType(buildObject(dictionary.allTokens), '  ');
    return GEN + '\n'
      + 'declare const vyd: {\n' + body + '\n};\n'
      + 'export default vyd;\nexport { vyd };\n';
  },
});

StyleDictionary.registerFormat({
  name: 'vyd/resolved-json',
  format: ({ dictionary }) => {
    const out = {};
    for (const t of dictionary.allTokens) out[vydName(t.path)] = t.value;
    return JSON.stringify(out, null, 2) + '\n';
  },
});

/* ---------------------------------------------------------------------
   Two passes: base (primitives + dark semantic) and light (overrides).
   No value transforms => hex casing & px units stay byte-identical to source.
   --------------------------------------------------------------------- */
const baseSD = new StyleDictionary({
  source: [join(CLEAN, 'tokens.json')],
  log: LOG,
  platforms: {
    cssparts: {
      transforms: [],
      buildPath: PARTS + '/',
      files: [{ destination: '_vars.base.css', format: 'vyd/css-base' }],
    },
    js: {
      transforms: [],
      buildPath: DIST + '/',
      files: [
        { destination: 'tokens.tailwind.js', format: 'vyd/tailwind' },
        { destination: 'tokens.js', format: 'vyd/js-cjs' },
        { destination: 'tokens.mjs', format: 'vyd/js-esm' },
        { destination: 'tokens.d.ts', format: 'vyd/dts' },
        { destination: 'tokens.resolved.json', format: 'vyd/resolved-json' },
      ],
    },
  },
});

const lightSD = new StyleDictionary({
  source: [join(CLEAN, 'tokens.json'), join(CLEAN, 'tokens.light.json')],
  log: LOG,
  platforms: {
    light: {
      transforms: [],
      buildPath: PARTS + '/',
      files: [{ destination: '_vars.light.css', format: 'vyd/css-light' }],
    },
  },
});

await baseSD.buildAllPlatforms();
await lightSD.buildAllPlatforms();

/* ---------------------------------------------------------------------
   Assemble final CSS files. (Only create/overwrite inside the repo.)
   --------------------------------------------------------------------- */
const PKG_VERSION = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version;
const BAR = '='.repeat(69);
function header(name) {
  return [
    '/* ' + BAR,
    '   VYD DESIGN SYSTEM - ' + name + '  v' + PKG_VERSION,
    '   GENERATED from /tokens/tokens.json - DO NOT EDIT. Run: npm run build',
    '   Source of truth: /tokens/tokens.json. Consume SEMANTIC tokens only.',
    '   ' + BAR + ' */',
  ].join('\n');
}

const baseCss = readFileSync(join(PARTS, '_vars.base.css'), 'utf8').trimEnd();
const lightCss = readFileSync(join(PARTS, '_vars.light.css'), 'utf8').trimEnd();
const primitives = existsSync(join(ROOT, 'css', 'primitives.css'))
  ? readFileSync(join(ROOT, 'css', 'primitives.css'), 'utf8').trimEnd()
  : '';

const variablesCss = header('variables.css') + '\n\n' + FONT_IMPORT + '\n\n' + baseCss + '\n\n' + lightCss + '\n';
writeFileSync(join(DIST, 'variables.css'), variablesCss);

const themeCss = header('theme.css') + '\n\n' + FONT_IMPORT + '\n\n' + baseCss + '\n\n' + lightCss + '\n\n' + primitives + '\n';
writeFileSync(join(DIST, 'theme.css'), themeCss);

rmSync(PARTS, { recursive: true, force: true });
rmSync(CLEAN, { recursive: true, force: true });

console.log('VYD build OK ->');
for (const f of ['theme.css', 'variables.css', 'tokens.tailwind.js', 'tokens.js', 'tokens.mjs', 'tokens.d.ts', 'tokens.resolved.json']) {
  console.log('  dist/' + f);
}
