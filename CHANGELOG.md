# Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
o projeto adere a [SemVer](https://semver.org/lang/pt-BR/).

Regra: **toda alteração de token** (valor, nome, adição, remoção) entra aqui com
o respectivo bump de versão. Apps fixam a versão que consomem.

## [Não lançado]

- —

## [0.6.0] — 2026-07-01

> **Fase 3 — Feedback & status** (roadmap). Componentes novos (sem mudança no contrato
> de tokens `--vyd-*`): bump minor por feature. `verify` OK.

### Adicionado

- **Feedback (CSS `.vyd-*`)**: `alert` (+ `--success/--warning/--danger`, ícone, close),
  `toaster`/`toast` (região viva, elevado), `progress` (determinado + `--indeterminate`),
  `spinner` (+ `--sm/--lg`), `skeleton`, `empty`, `badge` (+ variantes, `--dot`),
  `tag` (+ `--accent`, close). Animações respeitam `prefers-reduced-motion`.
- **`@vyd/react`**: `Alert`, `Toast`, `Toaster`, `Progress`, `Spinner`, `Skeleton`,
  `EmptyState`, `Badge`, `Tag`.
- **[`docs/FEEDBACK.md`](docs/FEEDBACK.md)** + demo **`demo/feedback.html`**.

## [0.5.0] — 2026-07-01

> **Fase 2 — Formulários** (roadmap). Componentes novos (sem mudança no contrato de
> tokens `--vyd-*`): bump minor por feature. `verify` OK.

### Adicionado

- **Controles de formulário** em `css/primitives.css`: `.vyd-field` (label + `__req`
  + `__help` + `__error`), `.vyd-textarea`, `.vyd-select` (seta própria), `.vyd-checkbox`,
  `.vyd-radio`, `.vyd-switch`, `.vyd-range`, `.vyd-input-group` (ícone + input),
  `.vyd-choice` (rótulo inline). Estados: hover/focus/disabled/**erro** (`aria-invalid`)/
  **read-only**/checked, todos por token.
- **`@vyd/react`**: `Field`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`,
  `Range`, `Choice`, `InputGroup`, `SearchInput`.
- **[`docs/FORMS.md`](docs/FORMS.md)** + demo **`demo/forms.html`** (todos os controles
  e estados).

## [0.4.0] — 2026-07-01

> **Fase 1 — Sistema de ícones** (roadmap). Novo diretório-fonte + pipeline + React +
> CSS + docs. Sem mudança no contrato de tokens `--vyd-*` (bump minor por feature).

### Adicionado

- **Ícones** — 40 ícones de linha (engenharia + UI) em `icons/*.svg` (grid 24, traço
  1.6, `currentColor`). Pipeline `build/build-icons.mjs` (`npm run build:icons`, e no
  `npm run build`) gera `dist/icons.svg` (sprite), `dist/icons.mjs/.js/.d.ts` (mapa +
  `IconName`) e `react/src/icons.generated.ts`.
- **`@vyd/react`**: componente `<Icon name size title>` (inline, tipado) + `icons`/`ICON_NAMES`.
- **CSS**: classe `.vyd-icon` (+ `--sm/--lg`) dimensionada pelos tokens de ícone.
- **Ribbon**: glyph placeholder substituído por ícones reais (`.vyd-ribbon-item .glyph`
  virou slot de ícone sem borda). `demo/index.html` com sprite inline + ícones.
- **Exports** do pacote: `./icons` (mapa) e `./icons.svg` (sprite). `icons/` em `files`.
- **[`docs/ICONS.md`](docs/ICONS.md)**: fonte, geração, tamanhos, consumo (React/CSS/
  sprite), como adicionar ícone, regras.

## [0.3.0] — 2026-07-01

> **Fase 0 — Fundações** (roadmap). Tokens novos **aditivos** (nada renomeado/removido):
> bump minor. `verify` OK, `build` idempotente.

### Adicionado

- **Tokens de fundação**: `zIndex` (base→tooltip), `opacity` (disabled/muted/backdrop/
  scrim), `size.control` (sm/md/lg) e `size.icon` (sm/md/lg), `breakpoint` (sm–xl,
  literais para `screens`/`matchMedia`), e `shadow.lg` (elevação de overlays).
  Nomes registrados em `build/lib.mjs`; preset Tailwind ganhou `zIndex`, `opacity`,
  `screens` e os sizes em `spacing`.
- **Estilos de texto (roles)**: `.vyd-display/.vyd-title/.vyd-heading/.vyd-subheading/
  .vyd-body/.vyd-caption/.vyd-code` (compõem os tokens de tipografia).
- **Densidade em runtime**: `[data-vyd-density="comfortable"|"compact"]` via
  `--vyd-control-h`. `.vyd-btn` e `.vyd-input` passam a usar a altura de controle
  tokenizada, com modificadores `--sm`/`--lg`.
- **`@vyd/react`**: `Button`/`Input` ganham prop `size`; novo componente `Text`
  (variantes de role).
- **[`docs/FOUNDATIONS.md`](docs/FOUNDATIONS.md)**: z-index, opacidade, sizing,
  densidade, elevação, breakpoints, roles de texto, foco/a11y.
- Demonstração de tamanhos de botão no `demo/brand-guide.html`.

## [0.2.0] — 2026-07-01

> **Ribbon como definição de primeira classe** + guia visual + camada React +
> símbolo unificado. Tokens `--vyd-*` **adicionados** (aditivo, sem renomear/remover):
> bump minor.

### Adicionado — Ribbon

- **Tokens de layout da ribbon**: `--vyd-layout-ribbon-tabs-h` (34px, faixa de abas)
  e `--vyd-layout-ribbon-command-h` (48px, altura do tile de comando). Também no
  preset Tailwind (`h-ribbon-tabs-h`, `h-ribbon-command-h`).
- **Faixa de abas** em `css/shell.css`: `.vyd-ribbon-tabs` + `.vyd-ribbon-tab`
  (ativa = sublinhado de acento 2px via `aria-selected`). O grid do `.vyd-app` ganhou
  uma track `auto` que **colapsa quando não há abas** (não quebra shells existentes).
- Tile de comando com **altura uniforme tokenizada** (`.vyd-ribbon .vyd-ribbon-item`).
- **`@vyd/react`**: componentes `RibbonTabs` e `RibbonTab`.
- **[`docs/RIBBON.md`](docs/RIBBON.md)**: documentação de primeira classe da ribbon
  (anatomia, dimensões, estados, exemplo canônico em CSS/Tailwind/React, regras).
- Abas adicionadas ao `demo/index.html`.

### Adicionado

- **`demo/brand-guide.html`**: o **Brand & UI Style Guide** completo (logo, paleta,
  tipografia, escala de espaçamento/raios, componentes) renderizado **a partir dos
  tokens `--vyd-*`** do repo — a seção de componentes usa as classes reais
  (`.vyd-btn`, `.vyd-input`, `.vyd-card`, `.vyd-ribbon-item`) e a seção 06 embute o
  app shell (`index.html`) via iframe. Reúne num só documento o guia visual (padrão
  Claude Design) e o app shell (padrão Autodesk). Estático, sem build.
- **`@vyd/react`** (`react/`): componentes React — wrappers finos sobre as classes
  `.vyd-*`, sem estilo próprio. Primitivas (`Button`, `Input`, `Card`, `Mono`,
  `CubeMark`) e o app shell completo (`AppShell`, `TopBar`, `Ribbon`, `RibbonItem`,
  `LeftRail`, `Canvas`, `RightPanel`, `Prop`, `StatusBar`, …). Distribuído como
  fonte TSX (o app transpila). Workspace único (`workspaces: ["react"]`), fora de
  `files` — não publicado com o pacote. `build`/`verify` do DS inalterados.

### Alterado

- **Símbolo oficial da marca — padrão único.** Toda a marca passa a usar a geometria
  **exata** do brand guide selecionado (cubo isométrico em **wireframe** com a
  **face-topo** destacada), eliminando a antiga aproximação de 3 faces sólidas. Cobre:
  - SVGs de logo: `brand/vyd-symbol.svg`, `vyd-symbol-mono.svg`, `vyd-lockup.svg`,
    `vyd-lockup-negative.svg`;
  - **ícones** `brand/icons/` — `favicon.svg` reescrito no wireframe (arestas 2 / 1.2
    para legibilidade ≤16px) e **todos os PNG/ICO regenerados** (`npm run icons`);
  - brand inline de `demo/index.html` e o cubo de `demo/app-shell-preview.svg`;
  - o componente `CubeMark` de `@vyd/react`.

## [0.1.0] — 2026-06-29

Primeira versão estruturada do design system como pacote publicável.

### Adicionado

- Estrutura de pacote: `/tokens` (fonte), `/css` (primitivas), `/dist` (build),
  `/tailwind`, `/docs`, `/build` (pipeline). `package.json` (`@vyd/design-system`),
  `LICENSE` (MIT), `.gitignore`, este changelog.
- Pipeline de build com **Style Dictionary** (`npm run build`) gerando a partir de
  `tokens/tokens.json`: `dist/theme.css`, `dist/variables.css`,
  `dist/tokens.tailwind.js` (preset), `dist/tokens.js` + `.mjs` + `.d.ts`,
  `dist/tokens.resolved.json`.
- Verificação automática (`npm run verify`) que garante que os nomes `--vyd-*`
  gerados continuam batendo com o contrato original e que não há tokens órfãos.
- Formalização do tema claro (`[data-vyd-theme="light"]`) em `tokens/tokens.light.json`
  — antes existia só no `theme.css`, sem fonte de verdade.
- Token semântico `--vyd-text-on-accent` (texto/ícone sobre superfície de acento).
- Primitivas de componente documentadas em `css/primitives.css` com estados
  normal / hover / active / focus / disabled (`.vyd-btn`, `.vyd-btn--ghost`,
  `.vyd-input`, `.vyd-card`, `.vyd-ribbon-item`, `.vyd-mono`).
- `docs/USAGE.md`: guia de consumo (CSS puro e Tailwind) e processo de mudança.

### Corrigido

- `.vyd-btn` usava `--vyd-neutral-1000` (escala bruta) para a cor do texto,
  violando a regra de ouro; agora usa o token semântico `--vyd-text-on-accent`.
- `dist/theme.css` passa a emitir `--vyd-space-0`, `--vyd-radius-none`,
  `--vyd-shadow-none` e `--vyd-ls-normal` (definidos em `tokens.json`, antes
  ausentes no CSS).

### Notas de migração

- Os valores e nomes de variáveis existentes (`--vyd-*`) foram preservados 1:1.
  Apps que já importavam `theme.css` continuam funcionando ao trocar para
  `dist/theme.css`. As únicas adições são os tokens citados acima.

[Não lançado]: https://github.com/<owner>/vyd-design-system/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/<owner>/vyd-design-system/releases/tag/v0.1.0
