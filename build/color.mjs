/* =====================================================================
   VYD Design System — build/color.mjs
   Motor de cor OKLCH (Björn Ottosson), puro e sem deps.

   Modo 3.0 = PINADO: os hex sRGB do token source continuam a verdade
   emitida (zero mudança visual em telas sRGB; contrast gate e baselines
   intactos). Este módulo:
     1) converte hex -> OKLCH (notação perceptual, base p/ derivações);
     2) gera o bloco @media (color-gamut: p3) com o acento de MARCA e a
        paleta viz levemente mais vivos (chroma +8%) em telas wide-gamut —
        L (lightness percebida) e H (matiz) inalterados.
   A regeneração perceptual das ESCALAS (experimento pós-3.0) usará as
   mesmas funções.
   ===================================================================== */

export function hexToLinearRgb(hex) {
  const h = String(hex).replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => {
    const c = parseInt(full.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
}

/** hex sRGB -> { L, C, H } (OKLCH; L 0..1, H em graus). */
export function hexToOklch(hex) {
  const [r, g, b] = hexToLinearRgb(hex);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const C = Math.hypot(a, bb);
  let H = (Math.atan2(bb, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

/** Serializa p/ CSS: oklch(52.7% 0.155 262.4). chromaBoost multiplica C. */
export function oklchCss(hex, chromaBoost = 1) {
  const { L, C, H } = hexToOklch(hex);
  const c = C * chromaBoost;
  // Cinzas (C≈0) não ganham boost perceptível; matiz vira irrelevante.
  return `oklch(${(L * 100).toFixed(2)}% ${c.toFixed(4)} ${C < 0.0005 ? 0 : H.toFixed(1)})`;
}
