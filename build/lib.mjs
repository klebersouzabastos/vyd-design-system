/* =====================================================================
   VYD Design System — build/lib.mjs
   The NAMING CONTRACT. Maps token paths (from tokens.json) to the exact
   hand-curated `--vyd-*` CSS variable names that apps already consume.
   A naive Style Dictionary export would rename everything and break apps;
   this module guarantees byte-for-byte the legacy names.
   Pure functions, no deps — easy to unit-test (see build/verify.mjs).
   ===================================================================== */

/** camelCase / PascalCase -> kebab-case (lowercased). '2xl' -> '2xl'. */
export function kebab(s) {
  return String(s).replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Layout dims use bespoke abbreviations (height->h, width->w, collapsed->w-min). */
const LAYOUT_MAP = {
  'layout.topbar.height':           'vyd-layout-topbar-h',
  'layout.ribbon.height':           'vyd-layout-ribbon-h',
  'layout.ribbon.tabsHeight':       'vyd-layout-ribbon-tabs-h',
  'layout.ribbon.commandHeight':    'vyd-layout-ribbon-command-h',
  'layout.statusbar.height':        'vyd-layout-statusbar-h',
};

/** token path (array) -> css custom-property name WITHOUT the leading `--`. */
export function vydName(path) {
  const p = path;
  const j = p.join('.');
  if (LAYOUT_MAP[j]) return LAYOUT_MAP[j];

  if (p[0] === 'color') {
    if (p[1] === 'brand' && p[2] === 'blueprint') return `vyd-blueprint-${p[3]}`;
    if (p[1] === 'neutral') return `vyd-neutral-${p[2]}`;
    if (p[1] === 'semantic') {
      const grp = p[2];
      const leaf = kebab(p[3]);
      if (grp === 'feedback') return `vyd-${leaf}`;          // success/warning/danger/info
      return `vyd-${grp}-${leaf}`;                            // bg/text/border/action
    }
    if (p[1] === 'viz') {
      if (p[2] === 'cat') return `vyd-viz-${p[3]}`;          // vyd-viz-1..6
      if (p[2] === 'seq') return `vyd-viz-seq-${p[3]}`;      // vyd-viz-seq-1..5
    }
  }
  if (p[0] === 'typography') {
    if (p[1] === 'family')        return `vyd-font-${kebab(p[2])}`;
    if (p[1] === 'size')          return `vyd-text-${p[2]}`;   // size.base -> --vyd-text-base
    if (p[1] === 'weight')        return `vyd-weight-${kebab(p[2])}`;
    if (p[1] === 'lineHeight')    return `vyd-lh-${kebab(p[2])}`;
    if (p[1] === 'letterSpacing') return `vyd-ls-${kebab(p[2])}`;
  }
  if (p[0] === 'space')  return `vyd-space-${p[1]}`;
  if (p[0] === 'radius') return `vyd-radius-${kebab(p[1])}`;
  if (p[0] === 'border' && p[1] === 'width') return `vyd-border-${kebab(p[2])}`;
  if (p[0] === 'shadow') return `vyd-shadow-${kebab(p[1])}`;
  if (p[0] === 'state')      return `vyd-state-${kebab(p[1])}-${kebab(p[2])}`; // state.selected.mix -> vyd-state-selected-mix
  if (p[0] === 'zIndex')     return `vyd-z-${kebab(p[1])}`;
  if (p[0] === 'opacity')    return `vyd-opacity-${kebab(p[1])}`;
  if (p[0] === 'size')       return `vyd-size-${kebab(p[1])}-${kebab(p[2])}`; // size.control.md -> vyd-size-control-md
  if (p[0] === 'breakpoint') return `vyd-bp-${kebab(p[1])}`;
  if (p[0] === 'motion') {
    if (p[1] === 'duration') return `vyd-duration-${kebab(p[2])}`;
    if (p[1] === 'easing')   return `vyd-ease-${kebab(p[2])}`;
  }
  // Defensive fallback (should not be hit with the current token set).
  return 'vyd-' + p.map(kebab).join('-');
}

/** Replace `{a.b.c}` references inside a value with `var(--vyd-...)`. */
export function refToVar(str) {
  return String(str).replace(/\{([^}]+)\}/g, (_, ref) => `var(--${vydName(ref.split('.'))})`);
}

/** Valor de um token independente do modo do SD (DTCG `$value` ou legado `value`). */
export function tokenValue(token) {
  return token.$value !== undefined ? token.$value : token.value;
}

/** CSS emission value: keep the var() indirection when the SOURCE value is a
 *  reference (so the raw scale stays the single definition); otherwise emit the
 *  resolved literal (hex/px/etc), preserving original casing. */
export function cssValue(token) {
  const o = token.original || {};
  const origRaw = o.$value !== undefined ? o.$value : o.value;
  const orig = origRaw != null ? String(origRaw) : String(tokenValue(token));
  return orig.includes('{') ? refToVar(orig) : String(tokenValue(token));
}

/** Theme-dependent tokens that live in the [data-vyd-theme=...] blocks. */
export function isSemantic(path) {
  return path[0] === 'color' && path[1] === 'semantic'
    && ['bg', 'text', 'border', 'action'].includes(path[2]);
}

/** Render a `selector { --name: value; ... }` block from a token list. */
export function renderBlock(selector, tokens) {
  const lines = tokens.map((t) => `  --${vydName(t.path)}: ${cssValue(t)};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}
