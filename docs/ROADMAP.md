# VYD Design System — Auditoria de cobertura & Roadmap

_Baseline: **v2.0.0** (estável) · Fases **0–8 ✅** + endurecimento pós-1.0 (shell
ribbon-only, contraste AAA, enforcement p/ IA) · catálogo fechado._
_(v1.0.0 fechou as fases; v2.0.0 travou o padrão de UI antes da adoção ampla.)_

Método e regras: [`ROADMAP-PROMPT.md`](ROADMAP-PROMPT.md). Evolução daqui em diante
segue [GOVERNANCE.md](GOVERNANCE.md) (SemVer + depreciação)._

Legenda: ✅ pronto · 🟡 parcial · ⛔ ausente

---

## 1. Fundações (tokens)

| Fundação | Estado | Nota |
|---|---|---|
| Cor — escala de marca (blueprint 50–900) | ✅ | |
| Cor — neutros grafite (0–1000) | ✅ | |
| Cor — semânticos (bg/text/border/action) | ✅ | dark + light |
| Cor — feedback (success/warning/danger/info) | ✅ | |
| Cor — **data-viz** (série p/ gráficos de engenharia) | ✅ | `viz.cat.1–6` + `viz.seq.1–5` (Fase 7) |
| Cor — **state layers** (hover/press/selected overlays) | 🟡 | via tokens de ação/opacidade; sem camada única formal |
| Tipografia — famílias, escala xs–3xl, pesos, LH, LS | ✅ | |
| Tipografia — **estilos de texto** (roles: display/h/body/caption/code) | ✅ | `.vyd-display/title/heading/body/caption/code` (Fase 0) |
| Espaçamento (0–9, base 4px) | ✅ | |
| **Sizing** (alturas de controle: sm/md/lg) | ✅ | `size.control/icon` (Fase 0) |
| Raios (sm/md/lg/full) | ✅ | |
| Bordas (hairline/thick) | ✅ | |
| Sombra/elevação | ✅ | sm/md/**lg**/focus (Fase 0) |
| Motion (duration, easing) | ✅ | |
| **Z-index** (camadas: rail/ribbon/popover/modal/toast) | ✅ | `zIndex.*` (Fase 0) |
| **Opacidade** (disabled/backdrop/scrim) | ✅ | `opacity.*` (Fase 0) |
| **Breakpoints / responsivo** | ✅ | `breakpoint.*` (Fase 0) + shell responsivo (Fase 8) |
| **Grid & container** | 🟡 | shell é grid; sem sistema de grid genérico (apps usam Tailwind) |
| Layout do app shell (topbar/ribbon/rail/painel/status) | ✅ | ribbon tabs+command; responsivo (Fase 8) |
| Tokens de foco / a11y | ✅ | `--vyd-shadow-focus` + **tema high-contrast** (Fase 8) |
| **Densidade** (compacto padrão / confortável) | ✅ | `data-vyd-density` (Fase 0) |
| **Ícones** (set + tamanhos + stroke) | ✅ | sprite 24px currentColor + `Icon` (Fase 1) |

## 2. Componentes

| Grupo | Prontos ✅ | Ainda fora do catálogo 🟡 |
|---|---|---|
| **Ações** | button, button--ghost, icon-button, **menu/dropdown**, command palette (cmdk) | toggle, segmented, split-button |
| **Formulários** | input, textarea, number, **select**, **checkbox**, **radio**, **switch**, range/slider, search, input-group, choice, **field (label/help/erro)** | combobox, date/time picker, file upload |
| **Navegação** | **ribbon (tabs+grupos+comandos) — única nav**, top bar/switcher, tabs (standalone), breadcrumbs, pagination, steps/wizard, cmdk, kbd, **tree** | — |
| **Dados** | card, prop (key-value), avatar, mono, **table**, list, tag, **badge**, stat/KPI, **tooltip**, data-viz | data-grid editável (apps: lib sobre tokens) |
| **Feedback** | **alert/banner**, **toast**, **progress**, spinner, skeleton, empty state | inline message, confirm dedicado |
| **Overlays** | **modal/dialog**, drawer/sheet, **popover**, menu, tooltip, toolbar/floating bar | context menu nativo |
| **Layout** | topbar, ribbon, canvas (largura cheia), statusbar, **divider** | accordion, splitter/resizer, scroll area |

**Leitura:** catálogo fechado para 1.0 — **formulários, feedback, overlays, dados
densos, navegação e data-viz** entregues (Fases 2–7). O que resta é **aditivo**
(minor futuro): componentes de nicho e a data-grid editável, que apps montam sobre os
tokens quando precisarem.

## 3. Transversais

| Item | Estado |
|---|---|
| Tema dark | ✅ |
| Tema light | ✅ (`[data-vyd-theme="light"]`) |
| Tema high-contrast | ✅ (`[data-vyd-theme="high-contrast"]` + `prefers-contrast: more`) |
| Responsividade / breakpoints | ✅ (shell responsivo com opt-out `.vyd-app--fixed`) |
| i18n (pt-BR, numerais tabulares) | ✅ (propriedades lógicas RTL + [I18N.md](I18N.md)) |
| Documentação por componente | ✅ (doc dedicada por área: FORMS/FEEDBACK/OVERLAYS/DATA/NAV/DATAVIZ…) |
| Testes/validação | ✅ contrato (verify) + typecheck · 🟡 regressão visual (harness pronto; baselines no CI) |
| Distribuição | ✅ GitHub · ✅ npm (`private` removido; ver [PUBLISH.md](PUBLISH.md)) |
| Política de depreciação | ✅ ([GOVERNANCE.md](GOVERNANCE.md)) |
| Governança SemVer + CHANGELOG | ✅ |

---

## Roadmap priorizado

Ordem por **valor para as ferramentas** e por **dependência técnica** (fundações antes
dos componentes que as consomem). Cada fase segue o método do prompt: tokens → `.vyd-*`
→ Tailwind → `vyd-react` → docs → demo → build/verify → bump/CHANGELOG → merge.

### Fase 0 — Fundações que faltam (destrava o resto)  · _minor_
Tokens novos, aditivos: **z-index** (escala de camadas), **opacidade**, **sizing** de
controle (`control-sm/md/lg`), **elevação** para overlays, **estilos de texto** como
roles, **densidade** (compact/comfortable via `data-vyd-density`), **breakpoints**, e
**tokens de foco** auditados para contraste AA. Entrega a base de que Fases 2–4 dependem.
_Dependências: nenhuma. Esforço: M._

### Fase 1 — Sistema de ícones  · _minor_
Set de ícones de engenharia (traço 1.5–1.6, 24px grid, `currentColor`), convenção de
tamanho, e substituição do glyph placeholder da ribbon. Doc `docs/ICONS.md`.
_Dependências: Fase 0 (sizing). Esforço: M–L (depende do nº de ícones)._

### Fase 2 — Formulários completos  · _minor_
`field` (label/help/erro), textarea, number, **select**, combobox, **checkbox**,
**radio**, **switch**, slider, search, file upload; estados (focus/disabled/erro/
read-only) e validação. Maior alavanca para as ferramentas.
_Dependências: Fases 0–1. Esforço: L._

### Fase 3 — Feedback & status  · _minor_
alert/banner, **toast/notification** (+ região viva/ARIA), progress (linear/circular),
spinner, skeleton, empty state, **badge**, tag/chip, confirm.
_Dependências: Fase 0 (z-index, motion). Esforço: M._

### Fase 4 — Overlays  · _minor_
**modal/dialog**, drawer/sheet, **popover**, **tooltip**, menu/dropdown, context menu,
toolbar/floating bar. Foco em foco-trap, ESC, backdrop, posicionamento.
_Dependências: Fases 0 (z-index/elevação) e 1. Esforço: L._

### Fase 5 — Dados densos  · _minor_
**table/data-grid** (denso, sticky header, ordenação, seleção, edição inline, zebra
opcional), list, tree, stat/KPI, key-value estendido. O componente mais pedido em BIM/
obras.
_Dependências: Fases 0–4. Esforço: L–XL._

### Fase 6 — Navegação extra  · _minor_
tabs (standalone), breadcrumbs, pagination, stepper/wizard, command palette.
_Dependências: Fases 0–4. Esforço: M._

### Fase 7 — Data-viz  · _minor_
Tokens de série (categórica/sequencial), e padrões de gráfico p/ dados de engenharia
(barras/linha/gauge), acessíveis e on-brand.
_Dependências: Fase 0 (data-viz palette). Esforço: L._

### Fase 8 — Endurecimento & distribuição  · _minor → **1.0.0**_ ✅
Tema **high-contrast** (+ auto `prefers-contrast`), estratégia **responsiva** do shell
(`.vyd-app--fixed` opt-out), guia **i18n/RTL** (propriedades lógicas), **CI** +
**regressão visual** (Playwright), **política de depreciação** ([GOVERNANCE.md](GOVERNANCE.md))
e **publicação no npm** (`private` removido, [PUBLISH.md](PUBLISH.md) reescrito).
Catálogo fechado → corte **1.0.0** (tudo aditivo; nenhum app quebra).
_Dependências: Fases 1–7. Esforço: M._

---

## Sequência executada
**0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8** — todas concluídas, cada uma entrou na `main`
validada (build + verify + typecheck), versionada e documentada. Fechamento em
**v1.0.0**.

> **1.0.0 fechado.** Daqui em diante o sistema é estável: mudanças seguem
> [GOVERNANCE.md](GOVERNANCE.md) (adição = minor, quebra = major, com ciclo de
> depreciação). Novos componentes de nicho e a data-grid editável são candidatos a
> **minor** futuros — sem pressa e sem quebrar apps.
