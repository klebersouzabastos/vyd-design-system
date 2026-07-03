# VYD Design System

[![version](https://img.shields.io/badge/version-3.0.0-1E5FC4)](CHANGELOG.md)

> **Para IA (Claude/Lovable/Cursor):** leia **[AGENTS.md](AGENTS.md)** — regras duras do
> padrão (ribbon no topo, **sem menu lateral**, só tokens semânticos).

Fonte única de verdade visual do ecossistema **VYD** (Value Your Day) — ferramentas
de software para empresas de engenharia (gestão de obras, gestão de pessoas, geração
de documentos de engenharia, BIM). Estilo: **técnico, sóbrio, denso**. Acento:
**azul-blueprint** (`#1E5FC4`).

> Todo app importa os mesmos tokens. Mudou aqui → propaga em todos.

## Por que existe

Os apps são feitos em Lovable (Tailwind + React) e Claude Code (CSS puro ou Tailwind).
Sem um sistema central, cada app diverge e perde-se o reconhecimento de marca
tipo-Autodesk. Este repositório resolve isso com um **token source único** e um
**pipeline de build** que gera os artefatos que cada app consome.

## Estrutura

```
tokens/        Fonte de verdade (tokens.json + .light + .hc overrides)  ← EDITE AQUI
css/           Primitivas (.vyd-*) + app shell (shell.css), feitas à mão
build/         Pipeline Style Dictionary (lib.mjs, build.mjs, verify.mjs)
test/          Regressão visual (Playwright) — ver docs/TESTING.md
dist/          GERADO pelo build (não editar)
  ├─ theme.css            variáveis (dark+light+high-contrast) + primitivas  ← drop-in
  ├─ variables.css        só as variáveis
  ├─ tokens.tailwind.js   preset Tailwind (theme.extend)
  ├─ tokens.js / .mjs     objeto JS (CJS/ESM)
  ├─ tokens.d.ts          tipos
  └─ tokens.resolved.json valores resolvidos (hex/px)
tailwind/      Entry-point do preset (re-export de dist)
brand/         Logo (positiva/negativa/mono) + icons/ (favicon, PWA)
demo/          brand-guide.html (guia visual completo) + index.html (app shell) + preview
icons/         Ícones-fonte (SVG 24×24, currentColor) — geram dist/icons.*
docs/          USAGE · INTEGRATION · FOUNDATIONS · ICONS · FORMS · FEEDBACK · OVERLAYS · DATA · NAV · DATAVIZ · RIBBON · I18N · TESTING · GOVERNANCE · BRAND · BRIEF · PUBLISH · ROADMAP · ROADMAP-PROMPT
react/         vyd-react — componentes React (wrappers sobre .vyd-*)
```

## Ver o guia (sem instalar nada)

Abra **`demo/brand-guide.html`** no navegador — é o **Brand & UI Style Guide**
completo (logo, paleta, tipografia, espaçamento, componentes) renderizado a partir
dos tokens `--vyd-*`, com o **app shell** embutido na seção 06. O app shell isolado
fica em `demo/index.html`. Ambos consomem o `dist/` já commitado, então não precisam
de build.

## Regra de ouro

Apps consomem **tokens semânticos** (`--vyd-bg-panel`, `--vyd-action-primary`),
**nunca** a escala bruta (`--vyd-neutral-50`). Assim, trocar tema ou rebrandizar =
editar só este repo. Detalhes e snippets em **[docs/USAGE.md](docs/USAGE.md)**.

## Build

```bash
npm install
npm run build      # regenera dist/ a partir de tokens/tokens.json
npm run verify     # confere que o contrato --vyd-* não quebrou
npm run typecheck  # tipos do vyd-react (strict)
npm test           # build + verify + typecheck  (gate determinístico do CI)
```

Regressão visual (Playwright) e como manter baselines: **[docs/TESTING.md](docs/TESTING.md)**.

## Consumo (resumo)

**CSS puro / Claude Code** — importe o CSS e use as variáveis:

```css
@import "vyd-design-system/theme.css";
```
```html
<button class="vyd-btn">Salvar</button>
<!-- temas: <html data-vyd-theme="light|dark|high-contrast"> · dark é o default -->
<!-- high-contrast também auto-aplica em prefers-contrast: more -->
```

**Tailwind / Lovable** — importe o CSS e estenda o preset:

```js
// tailwind.config.js
const vyd = require("vyd-design-system/tailwind");
module.exports = { presets: [vyd], content: ["./src/**/*.{js,jsx,ts,tsx,html}"] };
```
```html
<button class="bg-action-primary text-on-accent rounded-md px-5 py-3">Salvar</button>
```

**React** — importe o CSS uma vez e use os componentes de `vyd-react` (wrappers
finos sobre as mesmas classes `.vyd-*`):

```tsx
import "vyd-design-system/theme.css";
import { Button, Mono } from "vyd-react";

<Button onClick={save}>Salvar</Button>
<Button variant="ghost">Cancelar</Button>
<Mono>VYD-OBR-0421</Mono>;
```

Detalhes e o app shell completo em React em **[react/README.md](react/README.md)**.

Passo a passo completo (incluindo uso programático em JS/TS) em
**[docs/USAGE.md](docs/USAGE.md)**.

## App shell invariante (a "ribbon Autodesk/Microsoft")

A casca é constante, o recheio muda. **Navegação SÓ pela ribbon no topo — sem menu
lateral esquerdo e sem painéis laterais.** O canvas ocupa a largura toda:

```
┌──────────────────────────────────────────────────────────┐
│ TOP BAR 44px — logo VYD + switcher de ferramenta + conta   │ ← idêntico
├──────────────────────────────────────────────────────────┤
│ RIBBON TABS 34px — Início · Modelagem · Documentos …       │ ← abas (1º nível)
│ RIBBON 88px — comandos agrupados em tiles (muda o conteúdo) │ ← comandos (2º nível)
├──────────────────────────────────────────────────────────┤
│                                                            │
│              CANVAS (a ferramenta) — largura CHEIA          │
│        listas/inspetores são conteúdo AQUI dentro           │
│                                                            │
├──────────────────────────────────────────────────────────┤
│ STATUS BAR 26px                                            │ ← idêntico
└──────────────────────────────────────────────────────────┘
```

> 🔴 **Regra dura:** o VYD **não usa** menu na lateral esquerda nem painéis laterais no
> shell. Toda navegação é a ribbon. Ver **[AGENTS.md](AGENTS.md)** — o `verify` falha se
> o shell reintroduzir rail/painel.

Implementação pronta em `css/shell.css` (layout opt-in). Importe depois do theme:

```css
@import "vyd-design-system/theme.css";
@import "vyd-design-system/shell.css";
```

Estrutura (coluna única): `.vyd-app` › `.vyd-topbar` · `.vyd-ribbon-tabs` ·
`.vyd-ribbon` · `.vyd-canvas` · `.vyd-statusbar`. Exemplo montado em `demo/index.html`.

**A ribbon é o padrão central e a única navegação** — anatomia, dimensões,
estados e exemplos em **[docs/RIBBON.md](docs/RIBBON.md)**.

## Governança / versionamento

SemVer (estável desde **1.0.0**). **Toda** mudança de token = build + bump de versão
+ entrada no [CHANGELOG.md](CHANGELOG.md). Apps fixam a versão (tag) que usam e
atualizam conscientemente. Nunca edite tokens direto num app. Política de versão,
ciclo de **depreciação** e classificação de bump em
**[docs/GOVERNANCE.md](docs/GOVERNANCE.md)**; publicação no npm em
**[docs/PUBLISH.md](docs/PUBLISH.md)**.

## Licença

[MIT](LICENSE) © K2+ / VYD
