import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Acessibilidade automatizada (axe-core) sobre as páginas de demo/ nos 3 temas.
 * Report-only na 2.1.0 (job com continue-on-error) — vira GATE na Fase 10,
 * quando os achados forem corrigidos. Falha em violações serious/critical.
 */

const PAGES = ['index', 'brand-guide', 'forms', 'feedback', 'overlays', 'data', 'nav', 'dataviz'];
const THEMES = ['dark', 'light', 'high-contrast'] as const;

async function settle(page: Page) {
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(150);
}

for (const name of PAGES) {
  for (const theme of THEMES) {
    test(`axe · ${name} · ${theme}`, async ({ page }) => {
      await page.goto(`/demo/${name}.html`, { waitUntil: 'networkidle' });
      await page.evaluate((t) => document.documentElement.setAttribute('data-vyd-theme', t), theme);
      await settle(page);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // O switcher do demo (demo.js) não faz parte do design system.
        .exclude('.vyd-demo-switcher')
        .analyze();

      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      if (serious.length) {
        console.log(`\n=== ${name} · ${theme} — ${serious.length} violação(ões) serious/critical ===`);
        for (const v of serious) {
          console.log(`- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nós)`);
          for (const n of v.nodes.slice(0, 3)) console.log(`    ${n.target.join(' ')}`);
        }
      }
      expect(serious, `violações serious/critical em ${name}/${theme}`).toEqual([]);
    });
  }
}
