# VYD — Integração nos apps (Lovable, Claude Code, React/Vite)

Como consumir o `vyd-design-system` (publicado no npm) em projetos **novos** ou
**já em andamento**. Introduzido na **v1.0.0**.

## O que o pacote entrega hoje

`npm install vyd-design-system` dá acesso a:

| Recurso | Import | Para quê |
|---|---|---|
| **Tokens + primitivas** | `vyd-design-system/theme.css` | variáveis `--vyd-*` (dark/light/high-contrast) **+** classes `.vyd-btn`, `.vyd-input`, `.vyd-card`, `.vyd-table`, `.vyd-alert`… |
| **Só variáveis** | `vyd-design-system/variables.css` | se você quiser as `--vyd-*` sem as classes de componente |
| **App shell** | `vyd-design-system/shell.css` | layout ribbon/rails/inspector (opt-in) |
| **Preset Tailwind** | `vyd-design-system/tailwind` | utilitários `bg-action-primary`, `text-primary`, `rounded-md`… |
| **Tokens em JS/TS** | `vyd-design-system` | objeto tipado (`vyd.color.action.primary` → `var(--vyd-…)`) |
| **Tokens crus** | `vyd-design-system/tokens.json` · `/dist/tokens.resolved.json` | ferramentas de design, geração |
| **Ícones** | `vyd-design-system/icons` · `/icons.svg` | sprite + mapa de nomes |
| **Componentes React** | pacote **`vyd-react`** (separado) | `Button`, `Field`, `Dialog`, `Table`, gráficos… — ver abaixo |

> 💡 Em React você pode usar **`vyd-react`** (componentes prontos) **ou** só as classes
> `.vyd-*` — os componentes apenas aplicam essas classes. Os dois consomem a mesma
> fonte de verdade; escolha por conveniência.

## Regra de ouro (vale em qualquer ferramenta)

Use **tokens semânticos**, nunca cor solta. O tema (dark/light/high-contrast) troca
sozinho porque tudo aponta pra `--vyd-*`. Default é **dark**; para claro:
`<html data-vyd-theme="light">`.

---

## Lovable (React + Tailwind)

### Prompt pronto (cole no chat do Lovable)

```
Integre o design system "vyd-design-system" (npm) neste projeto:

1. Instale: npm install vyd-design-system
2. No entry do app (src/main.tsx ou src/index.tsx), como PRIMEIRO import:
     import 'vyd-design-system/theme.css';
3. Se o projeto usa Tailwind v3, em tailwind.config.js adicione:
     presets: [require('vyd-design-system/tailwind')]
   (Se for Tailwind v4, NÃO use o preset JS — as variáveis do theme.css já
    funcionam; use classes vyd-* e valores como bg-[var(--vyd-action-primary)].)
4. A partir de agora, estilize SÓ com os tokens VYD. Nada de cores novas.
   - Botão primário: <button class="vyd-btn">…</button>
   - Superfícies: bg-chrome / bg-panel / bg-canvas; texto: text-primary / text-secondary
   - Bordas: border-default; acento: bg-action-primary + text-on-accent
   - Componentes prontos por classe: vyd-input, vyd-card, vyd-table, vyd-alert, vyd-badge…
5. Densidade técnica: base 13px, cantos contidos (rounded-md), hierarquia por
   linha (1px) e não por sombra. Tema padrão dark.
```

### Manual (se preferir você mesmo)

```bash
npm install vyd-design-system
```
```tsx
// src/main.tsx — primeiro import de tudo
import 'vyd-design-system/theme.css';
```
```js
// tailwind.config.js (Tailwind v3)
module.exports = {
  presets: [require('vyd-design-system/tailwind')],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
};
```

**Tailwind v3 × v4:** o preset é um `module.exports` (formato v3). Se o app for
**v4** (config em CSS via `@theme`), pule o preset — o `theme.css` já define todas as
`--vyd-*` globalmente, então `.vyd-*` e `bg-[var(--vyd-action-primary)]` funcionam
sem preset. Descubra a versão com `npx tailwindcss -v`.

---

## Claude Code (nos seus projetos)

O fluxo é o mesmo; você controla direto. Peça ao Claude Code:

```
Adicione o vyd-design-system a este projeto e migre a UI para ele:
- npm install vyd-design-system
- importe 'vyd-design-system/theme.css' uma vez no entry (ou @import no CSS global)
- (Tailwind v3) adicione o preset require('vyd-design-system/tailwind')
- troque estilos ad-hoc pelas classes .vyd-* e pelas variáveis --vyd-*
- não crie cores/spacings novos: use só tokens semânticos (bg-panel, action-primary…)
- tema dark por padrão; light via <html data-vyd-theme="light">
```

**Projeto sem Tailwind (CSS puro):**
```css
/* seu global.css */
@import 'vyd-design-system/theme.css';
```
```html
<button class="vyd-btn">Salvar</button>
<div class="vyd-card">…</div>
```

**Usando os tokens em JS/TS:**
```ts
import vyd from 'vyd-design-system';
element.style.background = vyd.color.bg.panel;   // => var(--vyd-bg-panel)
```

---

## Aplicando num app JÁ em andamento (adoção incremental)

Não precisa reescrever tudo de uma vez:

1. **Importe o `theme.css` uma vez.** Ele só *define* variáveis e classes `.vyd-*` —
   não afeta nada que já existe até você usar as classes/utilitários.
2. **Adote por tela/componente.** Troque um botão por `.vyd-btn`, um card por
   `.vyd-card`, e vá expandindo. O antigo e o novo convivem.
3. **Unifique cores primeiro.** O ganho maior é trocar hex soltos por
   `var(--vyd-…)` / utilitários `bg-*`/`text-*` — aí o tema passa a funcionar.
4. **Fixe a versão.** No `package.json` do app, mantenha `"vyd-design-system": "1.x"`
   e suba MAJOR conscientemente (ver [GOVERNANCE.md](GOVERNANCE.md)).
5. **App shell (opcional).** Se o app tem cara de ferramenta (ribbon/rails), importe
   também `shell.css` e monte `.vyd-app` (ver [RIBBON.md](RIBBON.md)).

### Conflito com o Tailwind/estilos atuais?

- As classes `.vyd-*` têm nomes próprios — não colidem com utilitários Tailwind.
- Se o reset/preflight do app brigar com algo, importe o `theme.css` **depois** do
  seu CSS base para as `--vyd-*` prevalecerem.
- Fontes: o `theme.css` faz `@import` de Inter Tight + JetBrains Mono (Google Fonts).
  Se seu app é offline/estrito, hospede as fontes e redefina `--vyd-font-sans/mono`.

---

## Temas

```html
<html data-vyd-theme="dark">            <!-- padrão -->
<html data-vyd-theme="light">
<html data-vyd-theme="high-contrast">   <!-- a11y; auto em prefers-contrast: more -->
```

Troque em runtime com `document.documentElement.setAttribute('data-vyd-theme', …)`.

---

## Componentes React — pacote `vyd-react`

Wrappers finos (`Button`, `Field`, `Dialog`, `Table`, `Alert`, gráficos, app shell…)
sobre as classes `.vyd-*`. Pacote **separado** no npm.

```bash
npm install vyd-react vyd-design-system
```
```tsx
// entry do app: importe o CSS do design system UMA vez
import 'vyd-design-system/theme.css';
import 'vyd-design-system/shell.css';   // opcional: app shell

import { Button, Field, Dialog, Mono } from 'vyd-react';

<Button onClick={save}>Salvar</Button>
<Button variant="ghost">Cancelar</Button>
<Field label="Obra"><input className="vyd-input" /></Field>
<Mono>VYD-OBR-0421</Mono>
```

- **Peers:** `react`, `react-dom` e `vyd-design-system` (o `vyd-react` não importa CSS;
  o app importa o `theme.css`).
- Distribuído **compilado** (JS ESM + tipos `.d.ts`), com `'use client'` preservado nos
  componentes interativos (`Dialog`, `Menu`, `Popover`, `CommandPalette`) → funciona em
  **Next.js (App Router)** e **Vite**.
- Detalhes e catálogo completo em [`../react/README.md`](../react/README.md).

> Fundações: [FOUNDATIONS.md](FOUNDATIONS.md) · uso geral: [USAGE.md](USAGE.md) ·
> versionamento: [GOVERNANCE.md](GOVERNANCE.md).
