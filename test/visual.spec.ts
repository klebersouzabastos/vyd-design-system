import { test, expect, type Page } from '@playwright/test';

/**
 * Regressão visual do VYD. Cada página de `demo/` vira um snapshot; o app
 * shell também é capturado nos três temas. A cor de fundo estabiliza antes
 * do disparo (evita flash de fonte). Fonts web via @import podem variar
 * offline — rode no runner de CI para baselines estáveis (ver docs/TESTING.md).
 */

// Páginas de componentes: um snapshot full-page cada.
const PAGES = [
  'index',       // app shell (ribbon + rails + inspector)
  'brand-guide',
  'forms',
  'feedback',
  'overlays',
  'data',
  'nav',
  'dataviz',
];

// Temas exercitados no app shell.
const THEMES = ['dark', 'light', 'high-contrast'] as const;

async function settle(page: Page) {
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(200);
}

for (const name of PAGES) {
  test(`demo/${name}`, async ({ page }) => {
    await page.goto(`/demo/${name}.html`, { waitUntil: 'networkidle' });
    await settle(page);
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}

for (const theme of THEMES) {
  test(`shell · tema ${theme}`, async ({ page }) => {
    await page.goto('/demo/index.html', { waitUntil: 'networkidle' });
    await page.evaluate((t) => document.documentElement.setAttribute('data-vyd-theme', t), theme);
    await settle(page);
    await expect(page).toHaveScreenshot(`shell-${theme}.png`);
  });
}

// Estratégia responsiva do shell: colapsos por breakpoint.
const VIEWPORTS = [
  { w: 1280, tag: 'desktop' },
  { w: 760, tag: 'tablet' }, // ≤768: rail só ícones, sem inspector
  { w: 600, tag: 'mobile' }, // ≤640: sem rail
];

for (const { w, tag } of VIEWPORTS) {
  test(`shell responsivo · ${tag}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 800 });
    await page.goto('/demo/index.html', { waitUntil: 'networkidle' });
    await settle(page);
    await expect(page).toHaveScreenshot(`shell-responsive-${tag}.png`);
  });
}
