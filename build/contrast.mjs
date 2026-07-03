/* =====================================================================
   VYD Design System — build/contrast.mjs
   Gate de contraste WCAG 2.1. Resolve os tokens semânticos por tema
   (dark = base; light/high-contrast = base + overrides) e garante que
   o texto seja legível. Puro, sem deps — testável e usado por verify.mjs.

   Política (ver docs/GOVERNANCE.md):
     - texto primário / secundário / accent  ≥ 7:1  (WCAG AAA)
     - rótulo sobre o acento de MARCA (onAccent) ≥ 4.5:1 (AA — o azul-blueprint
       #1E5FC4 não alcança AAA sem trocar a cor da marca)
     - texto disabled ≥ 3:1 (isento por WCAG; mira usabilidade)
     - border.default é informativo (divisor fino, decorativo) — nunca falha
   ===================================================================== */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.VYD_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');

/* ---- cor / contraste (WCAG 2.1) ---- */
export function hexToRgb(hex) {
  const h = String(hex).replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
export function relLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrastRatio(fg, bg) {
  const L1 = relLuminance(fg);
  const L2 = relLuminance(bg);
  const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

/* ---- resolução de tokens por tema ---- */
function deepMerge(base, over) {
  if (over === undefined || over === null) return base;
  if (typeof base !== 'object' || typeof over !== 'object' || base === null) return over;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const k of Object.keys(over)) out[k] = deepMerge(base[k], over[k]);
  return out;
}

/** Carrega o tema mesclando overrides sobre a base e resolve os semânticos p/ hex. */
export function resolveTheme(overrideFiles = []) {
  let tree = JSON.parse(readFileSync(join(ROOT, 'tokens', 'tokens.json'), 'utf8'));
  for (const f of overrideFiles) {
    tree = deepMerge(tree, JSON.parse(readFileSync(join(ROOT, 'tokens', f), 'utf8')));
  }
  const get = (path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), tree);
  const resolve = (val) => {
    if (typeof val !== 'string') return val;
    const m = val.match(/^\{(.+)\}$/);
    if (!m) return val;
    return resolve(get(m[1]).$value);
  };
  const sem = (p) => resolve(get('color.semantic.' + p).$value);
  return {
    bg: {
      chrome: sem('bg.chrome'), panel: sem('bg.panel'), canvas: sem('bg.canvas'),
      elevated: sem('bg.elevated'), tooltip: sem('bg.tooltip'),
    },
    text: {
      primary: sem('text.primary'), secondary: sem('text.secondary'),
      disabled: sem('text.disabled'), onAccent: sem('text.onAccent'), accent: sem('text.accent'),
      tooltip: sem('text.tooltip'),
    },
    action: { primary: sem('action.primary') },
    border: { default: sem('border.default') },
    feedback: { warning: sem('feedback.warning'), onWarning: sem('feedback.onWarning') },
    control: { glyph: sem('control.glyph'), checkGlyph: sem('control.checkGlyph') },
  };
}

export const THEMES = [
  { name: 'dark', overrides: [] },
  { name: 'light', overrides: ['tokens.light.json'] },
  { name: 'high-contrast', overrides: ['tokens.hc.json'] },
];

const AAA = 7, AA = 4.5, UI = 3;

/** Retorna as linhas de checagem de um tema (com pass/gated). */
export function checkTheme(t) {
  const rows = [];
  const add = (label, fg, bg, min, gated = true) =>
    rows.push({ label, fg, bg, ratio: contrastRatio(fg, bg), min, gated });
  for (const surf of ['canvas', 'panel', 'chrome']) {
    add(`text.primary on bg.${surf}`, t.text.primary, t.bg[surf], AAA);
    add(`text.secondary on bg.${surf}`, t.text.secondary, t.bg[surf], AAA);
  }
  add('text.accent on bg.panel', t.text.accent, t.bg.panel, AAA);
  add('text.disabled on bg.panel', t.text.disabled, t.bg.panel, UI);
  add('onAccent on action.primary', t.text.onAccent, t.action.primary, AA);
  add('text.tooltip on bg.tooltip', t.text.tooltip, t.bg.tooltip, AAA);
  add('onWarning on feedback.warning', t.feedback.onWarning, t.feedback.warning, AA);
  add('control.glyph on bg.panel', t.control.glyph, t.bg.panel, UI);
  add('border.default on bg.panel', t.border.default, t.bg.panel, UI, false); // info
  return rows.map((r) => ({ ...r, pass: !r.gated || r.ratio >= r.min }));
}

/** Roda todos os temas; retorna { rows, failures }. */
export function runContrast() {
  const rows = [];
  for (const th of THEMES) {
    for (const r of checkTheme(resolveTheme(th.overrides))) rows.push({ theme: th.name, ...r });
  }
  return { rows, failures: rows.filter((r) => r.gated && !r.pass) };
}
