# VYD — Ribbon (navegação por comandos)

A **ribbon** é o padrão **invariante** de acesso às funções do sistema em todo app
VYD — a distribuição dos botões de comando no topo, estilo Autodesk. A casca é
sempre a mesma; só o conteúdo dos comandos muda de ferramenta para ferramenta.
Isso garante que o usuário reconhece qualquer app VYD e reaproveita a memória motora.

> Faz parte do **app shell** (`css/shell.css`). Importe depois do tema:
> ```css
> @import "vyd-design-system/theme.css";
> @import "vyd-design-system/shell.css";
> ```

## Anatomia

```
┌─ .vyd-ribbon-tabs ─────────────────────────────────────────────┐  ← abas (opcional)
│  Início   Modelagem   Documentos   Equipe                       │     ativa = sublinhado 2px
├─ .vyd-ribbon ──────────────────────────────────────────────────┤
│  ┌ .vyd-ribbon-group ┐ ┌ .vyd-ribbon-group ┐                    │
│  │ [◧] [▤] [⊞]        │ │ [▭] [⊡]           │   …               │  ← comandos (tiles)
│  │  PROJETO           │ │  ELEMENTOS        │                    │     group__label embaixo
│  └───────────────────┘ └───────────────────┘                    │
└────────────────────────────────────────────────────────────────┘
```

| Classe | Papel |
|---|---|
| `.vyd-ribbon-tabs` | Faixa de **abas** (troca de contexto). Opcional — se ausente, a linha do grid colapsa. |
| `.vyd-ribbon-tab` | Uma aba. Ativa via `aria-selected="true"` → sublinhado de acento. |
| `.vyd-ribbon` | Faixa de **grupos de comando**. |
| `.vyd-ribbon-group` | Um grupo de comandos relacionados. |
| `.vyd-ribbon-group__items` | Linha de comandos dentro do grupo. |
| `.vyd-ribbon-item` | Um **comando** (tile ícone + rótulo). Ativo via `aria-selected="true"`. |
| `.vyd-ribbon-group__label` | Rótulo do grupo (caixa alta, embaixo). |

## Dimensões (tokens)

Todas saem de `tokens/tokens.json › layout` e existem como `--vyd-layout-*`:

| Token CSS | Valor | O quê |
|---|---|---|
| `--vyd-layout-ribbon-tabs-h` | `34px` | altura da faixa de abas |
| `--vyd-layout-ribbon-h` | `88px` | altura da área de comandos (grupos) |
| `--vyd-layout-ribbon-command-h` | `48px` | altura do tile de comando |

Utilitários Tailwind equivalentes (via preset): `h-ribbon-tabs-h`, `h-ribbon-h`,
`h-ribbon-command-h`.

## Estados

**Aba (`.vyd-ribbon-tab`)** — normal `text-secondary` · hover `text-primary` ·
`aria-selected` → `text-primary` + **sublinhado de acento 2px** · focus → anel.

**Comando (`.vyd-ribbon-item`)** — normal `text-secondary` · hover `bg-elevated` +
`text-primary` · `aria-selected` → `text-accent` + **barra de acento 2px** ·
`aria-disabled` → `text-disabled` · focus → anel.

> A **barra/sublinhado de acento de 2px** (`--vyd-border-thick` na cor
> `--vyd-border-accent`) é a assinatura de "ativo" do VYD — a mesma no item de
> rail, na aba e no comando.

## Exemplo canônico (CSS puro / HTML)

```html
<div class="vyd-app" id="app">
  <!-- … topbar … -->

  <div class="vyd-ribbon-tabs" role="tablist" aria-label="Abas">
    <span class="vyd-ribbon-tab" role="tab" aria-selected="true"  tabindex="0">Início</span>
    <span class="vyd-ribbon-tab" role="tab" aria-selected="false" tabindex="0">Modelagem</span>
    <span class="vyd-ribbon-tab" role="tab" aria-selected="false" tabindex="0">Documentos</span>
  </div>

  <nav class="vyd-ribbon" aria-label="Comandos">
    <div class="vyd-ribbon-group">
      <div class="vyd-ribbon-group__items">
        <span class="vyd-ribbon-item" aria-selected="true">
          <span class="glyph">▣</span><span class="label">Modelo</span>
        </span>
        <span class="vyd-ribbon-item">
          <span class="glyph">⬚</span><span class="label">Níveis</span>
        </span>
      </div>
      <span class="vyd-ribbon-group__label">Projeto</span>
    </div>
    <!-- + grupos: Elementos, Anotar, Vista … -->
  </nav>

  <!-- … leftrail · canvas · rightpanel · statusbar … -->
</div>
```

> O `.glyph` é um placeholder (caixa com um caractere). Em produção, troque por um
> `<svg>` de ícone — mantendo `width/height: 22px` e `stroke: currentColor` para
> herdar a cor do estado.

## Em React (`@vyd/react`)

```tsx
import { Ribbon, RibbonTabs, RibbonTab, RibbonGroup, RibbonItem } from "@vyd/react";

<RibbonTabs>
  <RibbonTab selected>Início</RibbonTab>
  <RibbonTab onClick={() => go("modelagem")}>Modelagem</RibbonTab>
  <RibbonTab>Documentos</RibbonTab>
</RibbonTabs>

<Ribbon>
  <RibbonGroup label="Projeto">
    <RibbonItem glyph={<ModelIcon />} label="Modelo" selected />
    <RibbonItem glyph={<LevelsIcon />} label="Níveis" />
  </RibbonGroup>
  <RibbonGroup label="Elementos">
    <RibbonItem glyph={<WallIcon />} label="Parede" />
    <RibbonItem glyph={<SlabIcon />} label="Laje" />
  </RibbonGroup>
</Ribbon>
```

## Regras

- A **estrutura** (abas → grupos → comandos) é fixa em todo app; só o **conteúdo** muda.
- Um único **ativo** por faixa de abas e um por contexto de comando.
- Agrupe comandos por tarefa (Projeto / Elementos / Anotar / Vista…), não por tipo de
  widget. Rótulo de grupo em caixa alta.
- Nunca redefina cores/dimensões no app — use os tokens. Mudou aqui → propaga em todos.
- Referência viva montada em [`../demo/index.html`](../demo/index.html); o guia visual
  completo em [`../demo/brand-guide.html`](../demo/brand-guide.html).
