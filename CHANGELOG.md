# Changelog

Todas as mudanças notáveis deste projeto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
o projeto adere a [SemVer](https://semver.org/lang/pt-BR/).

Regra: **toda alteração de token** (valor, nome, adição, remoção) entra aqui com
o respectivo bump de versão. Apps fixam a versão que consomem.

## [Não lançado]

- —

## [3.1.1] — 2026-07-04

### Corrigido

- **`.vyd-cmdk`: `<dialog>` fechado ficava visível.** O `display: flex` da
  classe é estilo de autor e vencia o `dialog:not([open]) { display: none }`
  do user-agent, então um `<dialog class="vyd-cmdk vyd-cmdk--dialog">` montado
  fechado (como o `CommandPalette` do `vyd-react` faz via `useNativeDialog`)
  aparecia na tela. Novo guard `dialog.vyd-cmdk:not([open]) { display: none }`
  restaura o comportamento nativo; o uso não-dialog e o dialog aberto seguem
  `flex`. Apps que adotaram o workaround equivalente podem removê-lo.

## [3.1.0] — 2026-07-04

> **A11y & interação de elite** (programa VYD 3.0, Fase 10). Motor interativo
> **Base UI** encapsulado, a11y de teclado completa, **axe e vitest viram gates**
> no CI: zero violações serious/critical em 8 páginas × 3 temas.

### Adicionado

- **`vyd-react` — motor interativo Base UI (encapsulado):** `Menu` e `Popover`
  agora rodam sobre `@base-ui-components/react` (posicionamento, teclado, ESC,
  click-fora, portal) mantendo as classes `.vyd-*` e API própria
  (`open`/`defaultOpen`/`onOpenChange` — tipos Base UI nunca vazam). `Tooltip`
  segue CSS-first com `aria-describedby` automático.
- **`Button asChild`** (Slot próprio, sem dependência Radix) + **`forwardRef` em
  todos os primitivos** (`Button`, `Input`, `Card`, `Text`, `Mono`, controles de
  formulário).
- **`Field` com contexto ARIA:** injeta `id`, `aria-describedby`, `aria-invalid` e
  `aria-required` automaticamente em `Input`/`Textarea`/`Select` filhos (props
  explícitas sempre vencem).
- **Tabs de verdade:** `TabsRoot` (modo controlado/não-controlado) + `TabPanel`
  novos; setas ←/→ Home/End com roving tabindex e `aria-controls`. API antiga
  (`selected`) continua funcionando.
- **`CommandPalette` sobre `<dialog>` nativo:** focus-trap/ESC/inert do browser,
  input `role="combobox"` com `aria-activedescendant`, itens `role="option"`.
- **Ribbon operável por teclado:** `RibbonTabs` com setas, `RibbonTab`/`RibbonItem`
  com Enter/Space; item ativo usa **`aria-pressed`** (`aria-selected` era inválido
  em `role="button"`; o CSS aceita ambos por compat).
- **Tokens novos de TEXTO de feedback:** `feedback.successText`/`warningText`
  (`--vyd-success-text`/`--vyd-warning-text`) — verde/âmbar legíveis (AA ≥ 4.5)
  sobre panel/canvas/elevated nos 3 temas, com override light. Complementam
  `dangerText`; contraste agora com **69 pares** no gate.
- **CSS aditivo:** suporte à **Popover API nativa** para HTML puro
  (`.vyd-menu:popover-open` + `position-area` sob `@supports`),
  `.vyd-menu__item[data-highlighted]`, `.vyd-cmdk--dialog` (+`::backdrop`),
  `.vyd-list__item[aria-current="true"]` (canônico; `aria-selected` mantido).
- **Testes unitários (Vitest + Testing Library)** em `react/src/__tests__/` —
  teclado/ARIA de Menu, Tabs, CmdK, Ribbon, Field, Dialog. **Job `unit` = gate.**
- **Axe vira GATE** no CI (era report-only): 0 violações serious/critical.

### Corrigido

- Contraste AA dos badges: `feedback.onSuccess`/`onDanger` novos;
  `feedback.danger` escurecido 2 passos (`#D24545` → `#D04343`) p/ rótulo branco
  passar 4.5:1; `.vyd-field__error`, `.vyd-menu__item--danger` e
  `.vyd-stat__delta--down` usam `--vyd-danger-text`; `.vyd-stat__delta--up` usa
  `--vyd-success-text` (o verde-superfície reprovava como texto no light).
- `ListItem` (React) emite `aria-current` em vez de `aria-selected` (inválido em
  div sem role); `TreeItem` publica `aria-expanded` no próprio `role="treeitem"`
  (padrão APG) com botão de toggle rotulado (Expandir/Recolher).
- Demos: rótulos/nome acessível em todos os controles, `role="tree"`/`treeitem`,
  listbox do cmdk estático, contraste do chrome do brand-guide nos 3 temas.

## [3.0.0] — 2026-07-03

> **Fundação 3.0** (programa VYD 3.0, Fase 9). O motor do design system sobe ao
> estado-da-arte 2026: tokens **DTCG**, **cascade layers**, tier de **marca**
> white-label, **state layers**, motor **OKLCH + P3** e **densidade** por component
> tokens. Aparência padrão **pixel-idêntica** à 2.1 (provado por regressão visual);
> nomes `--vyd-*`/`.vyd-*` 100% preservados. Guia: [MIGRATION-3.md](MIGRATION-3.md).

### ⚠️ BREAKING CHANGES

- **`@layer vyd.tokens, vyd.components`** no CSS emitido (e `shell.css`): CSS
  não-layered do app agora SEMPRE vence o VYD — override previsível. Quem dependia
  de perder para o VYD por especificidade usa `theme.unlayered.css` (transição).
- **`tokens.json` em DTCG 2025.10** (`$value`/`$type`/`$description`): quebra só
  quem parseava o arquivo cru (`value` → `$value`). CSS/Tailwind/JS inalterados.

### Adicionado

- **Tier de marca (white-label):** `--vyd-brand-accent-{50..900}` entre os
  semânticos e a escala blueprint. Rebrand = sobrescrever só o tier; todo o acento
  (ação, foco, links, viz-seq) re-tinge em cadeia.
- **State layers:** `--vyd-state-{hover,selected,zebra,gridline,skeleton}-mix` +
  derivadas prontas (`--vyd-state-selected-bg`, `--vyd-state-hover-bg`). Receita
  única de color-mix; fim dos números mágicos (cmdk unificado 18→16%,
  sub-perceptual).
- **Motor OKLCH + wide-gamut P3** (`build/color.mjs`): em telas P3, acento de marca
  e paleta viz levemente mais vivos (`@media (color-gamut: p3)`, chroma +8%); sRGB
  pinado byte-idêntico.
- **Densidade por component tokens:** `component.control.h/padX` + `component.row.padY`
  (default/compact/comfortable) emitidos pelo build com os blocos `[data-vyd-density]`.
- **Tokens novos:** `bg.tooltip`/`text.tooltip` (conserta tooltip preto-no-preto no
  light), `feedback.onWarning`, `control.glyph/checkGlyph` (seta/check gerados pelo
  build como `--vyd-icon-*` — zero cor crua no CSS).
- **Gates novos no `verify`:** semantic-only (proíbe hex/escala bruta em `css/`),
  cobertura de reduced-motion, presença/ordem das layers, cadeia de marca, bloco P3,
  anti-legado DTCG. Contraste agora com 36 pares.
- **Reduced-motion global:** `prefers-reduced-motion` zera `--vyd-duration-*` e
  desliga TODAS as transições de uma vez (spinner desacelera; skeleton para).
- Export novo: `./theme.unlayered.css` (escape hatch de transição, 1 ciclo).

## [2.1.0] — 2026-07-03

> **Pré-fase do programa VYD 3.0 — rede de segurança.** Antes dos refactors da
> Fundação 3.0, os gates que provam pixel-neutralidade e acessibilidade entram no ar.

### Adicionado

- **Regressão visual vira GATE** no CI: o job `visual` compara contra baselines
  commitadas (`test/__screenshots__/`) e **falha** em qualquer diff. Baselines são
  geradas **sempre pelo runner de CI** via novo workflow
  [`update-baselines.yml`](.github/workflows/update-baselines.yml) (push numa branch
  `baselines/*` → PNGs commitados de volta na branch). Fim do falso-verde
  (`--update-snapshots` + `continue-on-error` removidos).
- **Acessibilidade automatizada**: `test/a11y.spec.ts` (axe-core, WCAG 2.1 A/AA) em
  todas as demos × 3 temas; job `a11y` **report-only** nesta fase (vira gate na
  Fase 10). Script `npm run test:a11y`.
- **Theme + density switcher nos demos** (`demo/demo.js`): alterna
  dark/light/high-contrast e compact/comfortable em qualquer página de demo;
  auto-oculto em automação (não contamina baselines nem axe).

### Corrigido

- **`vyd-react` instalável via GitHub**: adicionado `"prepare": "npm run build"`
  (o `dist/` é gitignored; sem `prepare`, `npm install github:…` vinha vazio).

## [2.0.0] — 2026-07-02

> **Major.** Trava o padrão de UI antes da adoção ampla: shell **ribbon-only** (sem
> menu lateral), contraste **WCAG AAA** com gate no build, e arquivos de regra para IA.
> Adoção ainda ~zero, então o custo de quebrar agora é mínimo e o ganho (padrão correto
> e legível) é permanente.

### ⚠️ BREAKING CHANGES

- **App shell é ribbon-only, coluna única.** Removidos do `shell.css`: **left rail**
  (`.vyd-leftrail`, `.vyd-rail-section__label`, `.vyd-rail-item`, `.vyd-app--rail-collapsed`)
  e **right panel** (`.vyd-rightpanel`, `.vyd-panel-section__label`, `.vyd-prop*`). O
  `.vyd-app` agora é `grid-template-columns: 1fr` (canvas em largura cheia).
- **`vyd-react`:** removidos `LeftRail`, `RailSectionLabel`, `RailItem`, `RightPanel`,
  `PanelSectionLabel`, `Prop`; `AppShell` perdeu a prop `railCollapsed`.
- **Tokens de layout removidos:** `layout.leftRail` e `layout.rightPanel`
  (`--vyd-layout-leftrail-w`, `-w-min`, `-rightpanel-w`) — somem do CSS, do preset
  Tailwind e do objeto de tokens.
- **Valores de token de cor alterados (contraste AAA):** dark `text-secondary`
  (neutral.500→700), `text-disabled` (400→500), `text-accent` (blueprint.300→200),
  `border-default` (neutral.300→400); light `text-secondary` (400→300),
  `text-disabled` (500→400), `border-default` (800→700); high-contrast `action-primary`
  (blueprint.400→500, corrige rótulo de botão). Nomes intactos; só os valores mudaram.

**Migração:** navegação → **ribbon** (abas + comandos no topo). Listas/inspetores/
propriedades que ficavam no rail ou no painel direito viram **conteúdo dentro do
canvas** (um card, um painel flutuante). Nada de menu lateral.

### Adicionado

- **`AGENTS.md`** e **`llms.txt`** (raiz, publicados no pacote): regras duras para IA
  (Claude/Lovable/Cursor) — ribbon é a única navegação, sem menu lateral, só tokens
  semânticos, texto legível.
- **Gate de contraste** (`build/contrast.mjs` + `verify.mjs`): calcula WCAG 2.1 por
  tema e **falha o build** se texto < AAA (7:1), onAccent < AA (4.5:1) ou disabled < 3:1.
- **Gate estrutural "sem rail"** no `verify.mjs`: falha se o shell reintroduzir
  `.vyd-leftrail`/`.vyd-rail-*`/`.vyd-rightpanel` ou perder a coluna única.
- **`docs/INTEGRATION.md`:** bloco "Regras do projeto" pronto p/ colar no
  `CLAUDE.md`/`.cursorrules`/Knowledge do Lovable; prompts atualizados com a regra
  ribbon-only. `docs/GOVERNANCE.md`: shell e contraste entram no contrato público.

### Distribuição

- Publicados **`vyd-design-system@2.0.0`** e **`vyd-react@2.0.0`** (peer
  `vyd-design-system >=2`). (Contexto: na 1.0.0 o pacote passou de `@vyd/design-system`
  a `vyd-design-system` — escopo `@vyd` indisponível — e `@vyd/react` virou o pacote
  publicável `vyd-react`, compilado com `'use client'` preservado.)

## [1.0.0] — 2026-07-01

> **Fase 8 — Endurecimento & 1.0** (roadmap). Primeira versão **estável**: catálogo
> fechado, contrato `--vyd-*` congelado sob SemVer. Mudanças **aditivas** (novo tema,
> shell responsivo, RTL, testes, governança) — nada renomeado/removido, então nenhum
> app quebra ao subir de `0.10` para `1.0`. `verify` + `typecheck` OK.

### Adicionado

- **Tema alto-contraste** (a11y): `tokens/tokens.hc.json` →
  bloco `[data-vyd-theme="high-contrast"]` (preto puro, texto branco, bordas fortes,
  acento azul mais claro). **Auto-aplica** em `@media (prefers-contrast: more)` para
  roots sem tema explícito. Coberto pelo `verify`.
- **Shell responsivo** (`css/shell.css`): colapsos progressivos por breakpoint —
  ≤1024 esconde o inspector, ≤768 rail vira só ícones, ≤640 rail some e ribbon
  compacta. Opt-out por app com `.vyd-app--fixed`.
- **i18n/RTL**: shell e primitivas migrados para **propriedades lógicas**
  (`border-inline-*`, `margin-inline-*`, `inset-inline-*`) → espelham com
  `dir="rtl"` sem código extra. Guia **[`docs/I18N.md`](docs/I18N.md)**.
- **Testes**: gate determinístico `npm test` (build + verify + **typecheck**) e
  **regressão visual** Playwright (`test/visual.spec.ts`, `test:visual[:update]`).
  CI em **[`.github/workflows/ci.yml`](.github/workflows/ci.yml)** (Node 18/20/22).
  **[`docs/TESTING.md`](docs/TESTING.md)**.
- **Governança**: política de SemVer + ciclo de depreciação em
  **[`docs/GOVERNANCE.md`](docs/GOVERNANCE.md)**.

### Alterado

- `verify` agora também confere o bloco `high-contrast` e a auto-aplicação
  `prefers-contrast: more`.
- `npm test` passou a incluir `typecheck` do `vyd-react`.

### Distribuição

- Removido `"private": true` — o pacote pode ser **publicado no npm**
  (`npm publish --access public`). `repository.url` apontando para o repo real.
  Ver **[`docs/PUBLISH.md`](docs/PUBLISH.md)**.

## [0.10.0] — 2026-07-01

> **Fase 7 — Data-viz** (roadmap). Tokens **aditivos** de paleta de dados (nada
> renomeado/removido) + gráficos. `verify` OK, `build` idempotente.

### Adicionado

- **Tokens de data-viz**: `color.viz.cat.1–6` (`--vyd-viz-1..6`, categórica sóbria
  sem roxo) e `color.viz.seq.1–5` (`--vyd-viz-seq-1..5`, tints blueprint). Nos nomes
  (`build/lib.mjs`), no objeto JS e no preset Tailwind (`viz-1..6`, `viz-seq-1..5`).
- **Gráficos (`vyd-react`, SVG/CSS sem dependência)**: `BarChart`, `LineChart`,
  `Sparkline`, `Gauge`, `Legend` e o helper `vizColor(i)`.
- **CSS**: `.vyd-legend`, `.vyd-barchart`, helpers `.vyd-chart*`.
- **[`docs/DATAVIZ.md`](docs/DATAVIZ.md)** + demo **`demo/dataviz.html`**.

## [0.9.0] — 2026-07-01

> **Fase 6 — Navegação extra** (roadmap). Componentes novos (sem mudança no contrato
> de tokens `--vyd-*`): bump minor por feature. `verify` OK.

### Adicionado

- **Navegação (CSS `.vyd-*`)**: `tabs`/`tab` (standalone), `breadcrumbs` (+ `__sep`),
  `pagination` (`page`, `__ellipsis`), `steps`/`step` (`--done/--current`, `__marker/
  __label`, `__line`), `cmdk` (command palette: `-backdrop`, `__search/__input/__list/
  __item/__empty`), `kbd`.
- **`vyd-react`**: `Tabs`, `Tab`, `Breadcrumbs`, `Pagination`, `Steps`, `Kbd` (presentacionais)
  e **`CommandPalette`** (client: busca + teclado ↑/↓/Enter/Esc + clique-fora).
- **[`docs/NAV.md`](docs/NAV.md)** + demo **`demo/nav.html`**.

## [0.8.0] — 2026-07-01

> **Fase 5 — Dados densos** (roadmap). Componentes novos (sem mudança no contrato de
> tokens `--vyd-*`): bump minor por feature. `verify` OK.

### Adicionado

- **Dados (CSS `.vyd-*`)**: `table` (+ `-wrap` com header sticky, `--zebra`, `--compact`,
  `.vyd-num`, `__sort` com `aria-sort`, linha `aria-selected`), `list` (`__item/__icon/
  __body/__title/__sub/__trailing`), `tree` (`__item/__toggle/__icon`, `aria-expanded`),
  `stat` (`__label/__value/__delta --up/--down`), `kv` (key-value).
- **`vyd-react`**: `TableWrap`, `Table`, `Thead`, `Tbody`, `Tr`, `Th` (sortable/numeric),
  `Td`, `List`, `ListItem`, `Tree`, `TreeItem`, `Stat`, `KeyValue`, `KV`.
- **[`docs/DATA.md`](docs/DATA.md)** + demo **`demo/data.html`**.

## [0.7.0] — 2026-07-01

> **Fase 4 — Overlays** (roadmap). Componentes novos (sem mudança no contrato de
> tokens `--vyd-*`): bump minor por feature. `verify` OK.

### Adicionado

- **Overlays (CSS `.vyd-*`)**: `dialog` (via `<dialog>` nativo — foco-trap/ESC/backdrop),
  `drawer` (`--right/--left/--bottom`), `menu` (`__item --danger/[disabled]`, `__sep`,
  `__label`), `popover`, `tooltip` (CSS hover/focus), `toolbar` (+ `__sep`).
  Camadas por `--vyd-z-*`, elevação por `--vyd-shadow-lg/md`.
- **`vyd-react`** (client components): `Dialog`, `Drawer` (open/onClose via `<dialog>`),
  `Menu`/`MenuItem`/`MenuSeparator`/`MenuLabel` e `Popover` (abrem no clique, fecham por
  clique-fora/ESC, reposicionam em scroll/resize), `Tooltip`, `Toolbar`/`ToolbarSeparator`.
- **[`docs/OVERLAYS.md`](docs/OVERLAYS.md)** + demo **`demo/overlays.html`**.

## [0.6.0] — 2026-07-01

> **Fase 3 — Feedback & status** (roadmap). Componentes novos (sem mudança no contrato
> de tokens `--vyd-*`): bump minor por feature. `verify` OK.

### Adicionado

- **Feedback (CSS `.vyd-*`)**: `alert` (+ `--success/--warning/--danger`, ícone, close),
  `toaster`/`toast` (região viva, elevado), `progress` (determinado + `--indeterminate`),
  `spinner` (+ `--sm/--lg`), `skeleton`, `empty`, `badge` (+ variantes, `--dot`),
  `tag` (+ `--accent`, close). Animações respeitam `prefers-reduced-motion`.
- **`vyd-react`**: `Alert`, `Toast`, `Toaster`, `Progress`, `Spinner`, `Skeleton`,
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
- **`vyd-react`**: `Field`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`,
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
- **`vyd-react`**: componente `<Icon name size title>` (inline, tipado) + `icons`/`ICON_NAMES`.
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
- **`vyd-react`**: `Button`/`Input` ganham prop `size`; novo componente `Text`
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
- **`vyd-react`**: componentes `RibbonTabs` e `RibbonTab`.
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
- **`vyd-react`** (`react/`): componentes React — wrappers finos sobre as classes
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
  - o componente `CubeMark` de `vyd-react`.

## [0.1.0] — 2026-06-29

Primeira versão estruturada do design system como pacote publicável.

### Adicionado

- Estrutura de pacote: `/tokens` (fonte), `/css` (primitivas), `/dist` (build),
  `/tailwind`, `/docs`, `/build` (pipeline). `package.json` (`vyd-design-system`),
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

[Não lançado]: https://github.com/klebersouzabastos/vyd-design-system/compare/v3.1.1...HEAD
[3.1.1]: https://github.com/klebersouzabastos/vyd-design-system/releases/tag/v3.1.1
[3.1.0]: https://github.com/klebersouzabastos/vyd-design-system/releases/tag/v3.1.0
[3.0.0]: https://github.com/klebersouzabastos/vyd-design-system/releases/tag/v3.0.0
[2.1.0]: https://github.com/klebersouzabastos/vyd-design-system/releases/tag/v2.1.0
[2.0.0]: https://github.com/klebersouzabastos/vyd-design-system/releases/tag/v2.0.0
[1.0.0]: https://github.com/klebersouzabastos/vyd-design-system/releases/tag/v1.0.0
[0.1.0]: https://github.com/klebersouzabastos/vyd-design-system/releases/tag/v0.1.0
