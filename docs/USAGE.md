# VYD Design System — Guia de uso

Objetivo: todos os apps do ecossistema VYD têm a mesma cara (navegação, componentes,
identidade). Só muda o conteúdo funcional. Para isso, **todo app consome os mesmos
tokens** deste repositório. Mudou aqui → propaga em todos.

---

## Regra de ouro

Os apps consomem **tokens semânticos** (`--vyd-bg-panel`, `--vyd-action-primary`,
`--vyd-text-primary`), **nunca** a escala bruta (`--vyd-neutral-50`, `--vyd-blueprint-500`).
Assim, trocar tema (dark/light) ou rebrandizar = editar só este repo.

A fonte de verdade é `tokens/tokens.json`. `dist/` é **gerado** — nunca edite à mão.

---

## Instalação

Enquanto não há publicação no npm, instale direto do GitHub:

```bash
npm install github:<owner>/vyd-design-system
# ou fixe uma versão/tag:
npm install github:<owner>/vyd-design-system#v0.1.0
```

> Apps devem **fixar a versão** (tag) que consomem e atualizar conscientemente.

---

## Caminho 1 — CSS puro / Claude Code

Importe o CSS gerado uma vez no root do app e use as variáveis `--vyd-*`.

```css
/* no CSS global do app */
@import "vyd-design-system/theme.css";
```

```html
<!-- o tema escuro é o padrão (no :root). Para tema claro: -->
<html data-vyd-theme="light"> ... </html>
```

Usando as variáveis e as primitivas:

```html
<button class="vyd-btn">Salvar</button>
<button class="vyd-btn vyd-btn--ghost">Cancelar</button>
<input class="vyd-input" placeholder="Buscar..." />

<div class="vyd-card" style="color: var(--vyd-text-primary);
     border-color: var(--vyd-border-default);">
  Painel com tokens semânticos.
</div>
```

Se preferir só as variáveis (sem as classes de componente), importe
`vyd-design-system/variables.css`.

---

## Caminho 2 — Tailwind / Lovable

1. Importe o CSS (as variáveis precisam existir em runtime):

```css
/* global.css */
@import "vyd-design-system/theme.css";
```

2. Estenda o preset no `tailwind.config.js` (cole exatamente):

```js
// tailwind.config.js
const vyd = require("vyd-design-system/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [vyd],
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
};
```

3. Use os utilitários mapeados (todos resolvem para `var(--vyd-*)`, então o
   tema dark/light continua funcionando):

```html
<button class="bg-action-primary text-on-accent rounded-md px-5 py-3
               hover:bg-action-primary-hover">
  Salvar
</button>

<aside class="bg-panel text-primary border border-default w-leftrail-w">
  left rail
</aside>

<div class="h-topbar-h bg-chrome">top bar</div>
```

Cores disponíveis (exemplos): `bg-chrome`, `bg-panel`, `bg-canvas`, `bg-elevated`,
`text-primary`, `text-secondary`, `text-on-accent`, `border-default`, `action-primary`,
`success`, `warning`, `danger`, além das escalas `blueprint-500`, `neutral-0`, etc.
Espaçamentos: `1`–`9` (grid 4px) e dimensões do app shell `topbar-h`, `ribbon-h`,
`leftrail-w`, `leftrail-w-min`, `rightpanel-w`, `statusbar-h`.

> No Lovable: cole o conteúdo de `dist/theme.css` no CSS global e o preset no
> `tailwind.config`. Instrua o Lovable a usar **apenas** utilitários/variáveis VYD.

---

## Uso programático (JS/TS)

```ts
import vyd from "vyd-design-system";

element.style.background = vyd.color.bg.panel;   // "var(--vyd-bg-panel)"
element.style.color = vyd.color.text.primary;     // "var(--vyd-text-primary)"
```

As folhas do objeto são referências `var(--vyd-*)`; importe `theme.css` para resolverem.
Para valores resolvidos (hex/px), use `dist/tokens.resolved.json`.

---

## Como propor uma mudança (governança)

1. Edite **apenas** `tokens/tokens.json` (ou `tokens/tokens.light.json` para overrides
   do tema claro). Nunca edite valores soltos num app.
2. Rode o build: `npm install && npm run build` (regenera `dist/`).
3. Rode a verificação: `npm run verify` (garante que o contrato `--vyd-*` não quebrou).
4. **Bump de versão** (SemVer) + entrada no `CHANGELOG.md`:
   - patch: ajuste de valor sem quebra;
   - minor: novos tokens (aditivo);
   - major: renomear/remover token (quebra de contrato).
5. Commit, tag (`vX.Y.Z`) e push. Apps atualizam a tag quando quiserem.

---

## App shell invariante

A casca é constante em toda ferramenta VYD; só o canvas muda. Dimensões em
`--vyd-layout-*`: top bar 44px, ribbon 88px, left rail 240px (48px colapsada),
right panel 300px, status bar 26px.
