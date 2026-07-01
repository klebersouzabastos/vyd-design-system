# VYD Design System — Auditoria de cobertura & Roadmap

_Baseline: **v0.5.0** · Fases **0 (fundações) ✅**, **1 (ícones) ✅** e
**2 (formulários) ✅** concluídas. Método e regras: [`ROADMAP-PROMPT.md`](ROADMAP-PROMPT.md)._

Legenda: ✅ pronto · 🟡 parcial · ⛔ ausente

---

## 1. Fundações (tokens)

| Fundação | Estado | Nota |
|---|---|---|
| Cor — escala de marca (blueprint 50–900) | ✅ | |
| Cor — neutros grafite (0–1000) | ✅ | |
| Cor — semânticos (bg/text/border/action) | ✅ | dark + light |
| Cor — feedback (success/warning/danger/info) | ✅ | |
| Cor — **data-viz** (série p/ gráficos de engenharia) | ⛔ | falta paleta categórica/sequencial |
| Cor — **state layers** (hover/press/selected overlays) | 🟡 | hoje via cores fixas; sem camada padronizada |
| Tipografia — famílias, escala xs–3xl, pesos, LH, LS | ✅ | |
| Tipografia — **estilos de texto** (roles: display/h/body/caption/code) | 🟡 | escala existe; faltam roles nomeados como classe/token |
| Espaçamento (0–9, base 4px) | ✅ | |
| **Sizing** (alturas de controle: sm/md/lg) | ⛔ | controles não têm escala de tamanho tokenizada |
| Raios (sm/md/lg/full) | ✅ | |
| Bordas (hairline/thick) | ✅ | |
| Sombra/elevação | 🟡 | sm/md/focus; falta escala de elevação p/ overlays |
| Motion (duration, easing) | ✅ | |
| **Z-index** (camadas: rail/ribbon/popover/modal/toast) | ⛔ | crítico p/ overlays |
| **Opacidade** (disabled/backdrop/scrim) | ⛔ | |
| **Breakpoints / responsivo** | ⛔ | shell é fixo; falta estratégia responsiva |
| **Grid & container** | ⛔ | |
| Layout do app shell (topbar/ribbon/rail/painel/status) | ✅ | inclui ribbon tabs+command (v0.2.0) |
| Tokens de foco / a11y | 🟡 | `--vyd-shadow-focus` existe; falta contraste AA auditado |
| **Densidade** (compacto padrão / confortável) | ⛔ | só compacto implícito |
| **Ícones** (set + tamanhos + stroke) | ⛔ | ribbon usa glyph placeholder |

## 2. Componentes

| Grupo | Prontos ✅ | Faltando ⛔/🟡 |
|---|---|---|
| **Ações** | button, button--ghost | icon-button, toggle, segmented, split-button, **menu/dropdown**, command palette |
| **Formulários** | input | textarea, number, **select**, combobox, **checkbox**, **radio**, **switch**, slider, date/time, file upload, search, **field (label/help/erro)**, fieldset, validação |
| **Navegação** | **ribbon (tabs+grupos+comandos)**, left rail, top bar/switcher | tabs (standalone), breadcrumbs, pagination, stepper/wizard, **tree** |
| **Dados** | card, prop (key-value), avatar, mono | **table/data-grid**, list, tag/chip, **badge**, stat/KPI, **tooltip**, data-viz |
| **Feedback** | — | **alert/banner**, **toast**, inline message, **progress**, spinner, skeleton, empty state, confirm |
| **Overlays** | — | **modal/dialog**, drawer/sheet, **popover**, context menu, toolbar/floating bar |
| **Layout** | canvas, rightpanel, statusbar | **divider**, accordion, splitter/resizer, scroll area |

**Leitura:** o **app shell (ribbon) está maduro**; o gap real são **formulários,
feedback, overlays e a table** — exatamente o que uma ferramenta de engenharia usa o
dia inteiro.

## 3. Transversais

| Item | Estado |
|---|---|
| Tema dark | ✅ |
| Tema light | ✅ (`[data-vyd-theme="light"]`) |
| Tema high-contrast | ⛔ |
| Responsividade / breakpoints | ⛔ |
| i18n (pt-BR, numerais tabulares) | 🟡 (mono tabular ok; sem guia i18n/RTL) |
| Documentação por componente | 🟡 (USAGE/RIBBON ok; resto sem doc dedicada) |
| Testes/validação (verify) | ✅ contrato de token · ⛔ regressão visual |
| Distribuição (GitHub) | ✅ · npm publish ⛔ (pacote `private`) |
| Política de depreciação | ⛔ |
| Governança SemVer + CHANGELOG | ✅ |

---

## Roadmap priorizado

Ordem por **valor para as ferramentas** e por **dependência técnica** (fundações antes
dos componentes que as consomem). Cada fase segue o método do prompt: tokens → `.vyd-*`
→ Tailwind → `@vyd/react` → docs → demo → build/verify → bump/CHANGELOG → merge.

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

### Fase 8 — Endurecimento & distribuição  · _minor/major_
Tema **high-contrast**, estratégia **responsiva** do shell, guia **i18n/RTL**,
**regressão visual** no CI, **política de depreciação**, e **publicação no npm**
(remover `private`, `docs/PUBLISH.md`). Possível corte **1.0.0** ao fechar o catálogo.
_Dependências: Fases 1–7. Esforço: M._

---

## Sugestão de sequência
**0 → 1 → 2 → 3 → 4 → 5** cobre ~80% do uso diário de uma ferramenta de engenharia.
**6 → 7 → 8** completa o catálogo e prepara o **1.0.0**.

> Próximo passo: escolha uma fase (recomendo começar pela **Fase 0**, que destrava as
> demais) e diga *"execute a Fase N"*. Cada fase entra na `main` validada, versionada e
> documentada.
