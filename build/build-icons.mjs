/* =====================================================================
   VYD Design System — build/build-icons.mjs
   Lê os SVGs-fonte de /icons/*.svg (grid 24, traço 1.6, currentColor) e gera:
     dist/icons.svg          sprite <symbol> para consumo em CSS/HTML (<use>)
     dist/icons.mjs / .js    mapa { nome: markup-interno } (ESM + CJS)
     dist/icons.d.ts         tipos (IconName)
     react/src/icons.generated.ts   mapa embutido para o componente <Icon> do vyd-react
   Run: npm run build:icons  (também roda dentro de npm run build)
   ===================================================================== */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = process.env.VYD_ROOT || join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'icons');
const DIST = join(ROOT, 'dist');
const GEN = '/* GENERATED from /icons/*.svg - DO NOT EDIT. Run: npm run build:icons */';
const STROKE = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

/** Extrai o conteúdo interno (paths) de um SVG-fonte, sem o <svg> externo. */
function innerOf(svg) {
  const m = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  return (m ? m[1] : '').replace(/\s+/g, ' ').trim();
}

const files = readdirSync(SRC).filter((f) => f.endsWith('.svg')).sort();
const icons = {};
for (const f of files) icons[f.replace(/\.svg$/, '')] = innerOf(readFileSync(join(SRC, f), 'utf8'));
const names = Object.keys(icons);

/* 1. sprite */
const symbols = names
  .map((n) => `  <symbol id="vyd-icon-${n}" viewBox="0 0 24 24" ${STROKE}>${icons[n]}</symbol>`)
  .join('\n');
writeFileSync(
  join(DIST, 'icons.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols}\n</svg>\n`,
);

/* 2. mapa JS (ESM + CJS) + tipos */
const mapLiteral = JSON.stringify(icons, null, 2);
const namesLiteral = JSON.stringify(names);
writeFileSync(
  join(DIST, 'icons.mjs'),
  `${GEN}\nexport const icons = ${mapLiteral};\nexport const iconNames = ${namesLiteral};\nexport default icons;\n`,
);
writeFileSync(
  join(DIST, 'icons.js'),
  `${GEN}\nconst icons = ${mapLiteral};\nconst iconNames = ${namesLiteral};\nmodule.exports = icons;\nmodule.exports.icons = icons;\nmodule.exports.iconNames = iconNames;\n`,
);
const union = names.map((n) => `'${n}'`).join(' | ');
writeFileSync(
  join(DIST, 'icons.d.ts'),
  `${GEN}\nexport type IconName = ${union};\nexport declare const icons: Record<IconName, string>;\nexport declare const iconNames: IconName[];\ndeclare const _default: Record<IconName, string>;\nexport default _default;\n`,
);

/* 3. módulo embutido para vyd-react (auto-contido) */
writeFileSync(
  join(ROOT, 'react', 'src', 'icons.generated.ts'),
  `${GEN}\nexport const ICONS = ${mapLiteral} as const;\nexport type IconName = keyof typeof ICONS;\nexport const ICON_NAMES = Object.keys(ICONS) as IconName[];\n`,
);

console.log(`VYD icons OK -> dist/icons.svg + icons.mjs/.js/.d.ts + react/src/icons.generated.ts (${names.length} ícones)`);
