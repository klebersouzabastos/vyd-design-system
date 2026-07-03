/* =====================================================================
   VYD Design System — build/verify.mjs
   Self-contained checks (run after `npm run build`):
     1. Every --vyd-* name implied by tokens.json is present in dist/theme.css
        and dist/variables.css  (naming contract not broken).
     2. The light theme emits its semantic overrides.
     3. The on-accent correction is applied (no raw --vyd-neutral-1000 as btn text).
     4. dist/tokens.tailwind.js, tokens.js, tokens.mjs require/parse and expose
        the expected token references.
   Exits non-zero on any failure.
   ===================================================================== */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { vydName, isSemantic } from './lib.mjs';
import { runContrast } from './contrast.mjs';

const ROOT = process.env.VYD_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
let failures = 0;
const fail = (m) => { console.error('  ✗ ' + m); failures++; };
const ok = (m) => console.log('  ✓ ' + m);

/* --- flatten a token JSON to leaf paths --- */
function flatten(node, prefix = [], out = []) {
  if (node && typeof node === 'object') {
    if ('$value' in node && typeof node.$value !== 'object') { out.push(prefix); return out; }
    if ('value' in node && !('$value' in node)) { throw new Error('token LEGADO (value sem $) em ' + prefix.join('.') + ' — use $value (DTCG)'); }
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('_') || k === '$schema') continue;
      flatten(v, [...prefix, k], out);
    }
  }
  return out;
}

const tokens = JSON.parse(readFileSync(join(ROOT, 'tokens', 'tokens.json'), 'utf8'));
const light = JSON.parse(readFileSync(join(ROOT, 'tokens', 'tokens.light.json'), 'utf8'));
const hc = JSON.parse(readFileSync(join(ROOT, 'tokens', 'tokens.hc.json'), 'utf8'));

const expectedAll = flatten(tokens).map(vydName);
const expectedLight = flatten(light).filter(isSemantic).map(vydName);
const expectedHc = flatten(hc).filter(isSemantic).map(vydName);

const declared = (css) => new Set([...css.matchAll(/(--vyd-[\w-]+)\s*:/g)].map((m) => m[1]));

/* --- 1 + 2: CSS contract --- */
for (const file of ['theme.css', 'variables.css']) {
  const css = readFileSync(join(ROOT, 'dist', file), 'utf8');
  const have = declared(css);
  const missing = expectedAll.filter((n) => !have.has('--' + n));
  if (missing.length) fail(`${file}: faltam ${missing.length} variáveis: ${missing.slice(0, 6).join(', ')}…`);
  else ok(`${file}: todas as ${expectedAll.length} variáveis do token source presentes`);

  // light block must exist with its semantic overrides
  const lightBlock = css.split('[data-vyd-theme="light"]')[1] || '';
  const missLight = expectedLight.filter((n) => !lightBlock.includes('--' + n + ':'));
  if (missLight.length) fail(`${file}: bloco light não emite ${missLight.join(', ')}`);
  else ok(`${file}: bloco light com ${expectedLight.length} overrides`);

  // high-contrast block (explicit selector) with its semantic overrides
  const hcBlock = (css.split('[data-vyd-theme="high-contrast"]')[1] || '').split('@media')[0];
  const missHc = expectedHc.filter((n) => !hcBlock.includes('--' + n + ':'));
  if (missHc.length) fail(`${file}: bloco high-contrast não emite ${missHc.join(', ')}`);
  else ok(`${file}: bloco high-contrast com ${expectedHc.length} overrides`);

  // high-contrast must also auto-apply via prefers-contrast: more
  if (!css.includes('@media (prefers-contrast: more)')) fail(`${file}: falta auto-aplicação @media (prefers-contrast: more)`);
  else ok(`${file}: high-contrast auto-aplica em prefers-contrast: more`);
}

/* --- 3: on-accent correction --- */
const theme = readFileSync(join(ROOT, 'dist', 'theme.css'), 'utf8');
if (!theme.includes('--vyd-text-on-accent')) fail('theme.css não define --vyd-text-on-accent');
else ok('--vyd-text-on-accent presente');
if (/\.vyd-btn\s*\{[^}]*color:\s*var\(--vyd-neutral-1000\)/s.test(theme)) fail('.vyd-btn ainda usa --vyd-neutral-1000 (escala bruta)');
else ok('.vyd-btn usa token semântico para a cor do texto');
if (!theme.includes('--vyd-shadow-focus: 0 0 0 2px var(--vyd-brand-accent-500)')) fail('shadow-focus não preservou a indireção var() via tier de marca');
else ok('shadow-focus mantém var(--vyd-brand-accent-500)');
// cadeia de marca: semânticos -> brand-accent -> blueprint (white-label = sobrescrever só brand-accent)
if (!theme.includes('--vyd-brand-accent-500: var(--vyd-blueprint-500)')) fail('tier de marca quebrado: --vyd-brand-accent-500 não aponta p/ blueprint-500');
else ok('cadeia de marca intacta (--vyd-brand-accent-* -> --vyd-blueprint-*)');
if (!theme.includes('--vyd-action-primary: var(--vyd-brand-accent-500)')) fail('action.primary não consome o tier de marca');
else ok('action.primary consome o tier de marca');

/* --- 4: JS artifacts --- */
try {
  const tw = require(join(ROOT, 'dist', 'tokens.tailwind.js'));
  const c = tw.theme.extend.colors;
  if (c['action-primary'] !== 'var(--vyd-action-primary)') throw new Error('colors.action-primary errado');
  if (c['blueprint-500'] !== 'var(--vyd-blueprint-500)') throw new Error('colors.blueprint-500 errado');
  if (tw.theme.extend.spacing['4'] !== 'var(--vyd-space-4)') throw new Error('spacing.4 errado');
  if (tw.theme.extend.spacing['topbar-h'] !== 'var(--vyd-layout-topbar-h)') throw new Error('spacing.topbar-h errado');
  ok('tokens.tailwind.js: preset válido (colors/spacing conferidos)');
} catch (e) { fail('tokens.tailwind.js: ' + e.message); }

try {
  const vyd = require(join(ROOT, 'dist', 'tokens.js'));
  if (vyd.color.action.primary !== 'var(--vyd-action-primary)') throw new Error('color.action.primary errado');
  if (vyd.color.text.onAccent !== 'var(--vyd-text-on-accent)') throw new Error('color.text.onAccent errado');
  if (vyd.font.sans !== 'var(--vyd-font-sans)') throw new Error('font.sans errado');
  if (vyd.layout['topbar-h'] !== 'var(--vyd-layout-topbar-h)') throw new Error('layout.topbar-h errado');
  ok('tokens.js: objeto válido (color/font/layout conferidos)');
} catch (e) { fail('tokens.js: ' + e.message); }

/* --- 5: contraste WCAG (gate de legibilidade) --- */
{
  const { rows, failures } = runContrast();
  for (const f of failures) {
    fail(`contraste ${f.theme}: ${f.label} = ${f.ratio.toFixed(2)} (< ${f.min})`);
  }
  if (!failures.length) {
    const gated = rows.filter((r) => r.gated).length;
    ok(`contraste: ${gated} pares aprovados (texto AAA≥7, onAccent AA≥4.5, disabled≥3) em dark/light/high-contrast`);
  }
}

/* --- 6: shell ribbon-only (sem menu lateral esquerdo) --- */
{
  const shellPath = join(ROOT, 'css', 'shell.css');
  const shell = readFileSync(shellPath, 'utf8');
  if (/\.vyd-leftrail|\.vyd-rail-/.test(shell)) fail('shell.css ainda contém .vyd-leftrail / .vyd-rail-* (menu lateral esquerdo é proibido no VYD)');
  else ok('shell.css sem left rail (.vyd-leftrail/.vyd-rail-*)');
  if (/\.vyd-rightpanel|\.vyd-prop\b/.test(shell)) fail('shell.css ainda contém .vyd-rightpanel / .vyd-prop (shell é ribbon + canvas cheio, sem painéis laterais)');
  else ok('shell.css sem painéis laterais (.vyd-rightpanel/.vyd-prop)');
  // .vyd-app deve ter uma única coluna de conteúdo
  const appBlock = (shell.split('.vyd-app {')[1] || '').split('}')[0];
  if (!/grid-template-columns:\s*1fr\s*;/.test(appBlock)) fail('.vyd-app não usa grid-template-columns: 1fr (deve ser coluna única, canvas cheio)');
  else ok('.vyd-app é coluna única (canvas cheio, sem trilha de rail/painel)');
}

/* --- 7: semantic-only (nenhuma cor crua/escala bruta em css/) --- */
{
  // Whitelist explícita: padrões legítimos por design.
  //  - scrim de backdrop: preto puro com opacidade TOKENIZADA (igual em todo tema)
  const WHITELIST = [/rgb\(0 0 0 \/ var\(--vyd-opacity-backdrop\)\)/g];
  for (const file of ['css/primitives.css', 'css/shell.css']) {
    let css = readFileSync(join(ROOT, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    for (const w of WHITELIST) css = css.replace(w, '/*wl*/');
    const bad = [
      ...css.matchAll(/#[0-9a-fA-F]{3,8}\b/g),
      ...css.matchAll(/\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch)\(/g),
      ...css.matchAll(/var\(--vyd-(?:neutral|blueprint|brand-accent)-\d+\)/g),
    ].map((m) => m[0]);
    if (bad.length) fail(`${file}: cor crua/escala bruta proibida (semantic-only): ${[...new Set(bad)].slice(0, 6).join(', ')}`);
    else ok(`${file}: semantic-only OK (sem hex/rgb/escala bruta fora da whitelist)`);
  }
  // Ícones de controle derivados de token devem estar emitidos
  for (const name of ['--vyd-icon-select-arrow', '--vyd-icon-checkbox-check']) {
    if (!theme.includes(name + ':')) fail(`theme.css não emite ${name} (ícone derivado de control.*)`);
    else ok(`${name} emitido pelo build (derivado de tokens)`);
  }
}

/* --- 8: reduced-motion (toda transition/animation coberta pela receita) --- */
{
  // Animações keyframe com duração literal DELIBERADA (tratadas no bloco
  // prefers-reduced-motion: spinner desacelera; skeleton/indeterminate param).
  const ANIM_WHITELIST = ['vyd-spin', 'vyd-skeleton', 'vyd-progress-slide'];
  for (const file of ['css/primitives.css', 'css/shell.css']) {
    const css = readFileSync(join(ROOT, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const offenders = [];
    for (const m of css.matchAll(/transition:\s*([^;]+);/g)) {
      if (!m[1].includes('var(--vyd-duration-')) offenders.push('transition: ' + m[1].trim().slice(0, 40));
    }
    for (const m of css.matchAll(/animation:\s*([^;]+);/g)) {
      const v = m[1];
      if (v.trim() === 'none') continue;
      if (!ANIM_WHITELIST.some((w) => v.includes(w))) offenders.push('animation: ' + v.trim().slice(0, 40));
    }
    if (offenders.length) fail(`${file}: motion fora da receita reduced-motion: ${offenders.slice(0, 3).join(' | ')}`);
    else ok(`${file}: todo motion usa var(--vyd-duration-*) ou está na whitelist de keyframes`);
  }
  const prim = readFileSync(join(ROOT, 'css', 'primitives.css'), 'utf8');
  if (!/prefers-reduced-motion:\s*reduce[\s\S]*?--vyd-duration-fast:\s*0\.01ms/.test(prim)) {
    fail('primitives.css: receita global de reduced-motion (zerar --vyd-duration-*) ausente');
  } else ok('receita global de reduced-motion presente (zera tokens de duração)');
}

console.log(failures ? `\nVERIFY FALHOU (${failures})` : '\nVERIFY OK');
process.exit(failures ? 1 : 0);
