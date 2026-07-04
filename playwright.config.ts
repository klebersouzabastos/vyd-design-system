import { defineConfig, devices } from '@playwright/test';

/**
 * Config de regressão visual do VYD.
 * As páginas de `demo/` são servidas como arquivos estáticos e comparadas
 * pixel-a-pixel contra baselines commitadas (`test/__screenshots__/`).
 *
 * Baselines são SENSÍVEIS AO AMBIENTE (renderização de fonte/antialias). Gere e
 * commite as baselines sempre no MESMO runner (o container de CI). Ver
 * docs/TESTING.md. Rode local: `npm run test:visual:update`.
 */
export default defineConfig({
  testDir: './test',
  snapshotDir: './test/__screenshots__',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  // Servidor estático da raiz do repo (demo/ referencia ../dist e ../css).
  webServer: {
    command: 'npx --yes http-server . -p 4321 -s -c-1',
    url: 'http://127.0.0.1:4321/demo/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:4321',
    ...devices['Desktop Chrome'],
    viewport: { width: 1280, height: 800 },
    // Ambientes com Chromium pré-instalado (ex.: sandbox de dev) apontam o
    // binário via VYD_CHROMIUM; no CI fica indefinido e o Playwright usa o seu.
    launchOptions: process.env.VYD_CHROMIUM
      ? { executablePath: process.env.VYD_CHROMIUM }
      : undefined,
  },
  expect: {
    // Tolerância a diferenças mínimas de antialiasing entre execuções.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: 'disabled' },
  },
});
