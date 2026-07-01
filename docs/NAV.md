# VYD — Navegação

Tabs, breadcrumbs, pagination, stepper/wizard, command palette e `kbd`.
Adicionado na **v0.9.0**. Importe `@vyd/design-system/theme.css`.

## Tabs · Breadcrumbs (CSS)

```html
<div class="vyd-tabs" role="tablist">
  <button class="vyd-tab" role="tab" aria-selected="true">Visão geral</button>
  <button class="vyd-tab" role="tab" aria-selected="false">Elementos</button>
  <button class="vyd-tab" role="tab" aria-selected="false" disabled>Histórico</button>
</div>

<nav class="vyd-breadcrumbs" aria-label="breadcrumb">
  <a class="vyd-breadcrumb" href="#">Obras</a>
  <span class="vyd-breadcrumbs__sep"><svg class="vyd-icon vyd-icon--sm"><use href="#vyd-icon-chevron-right"/></svg></span>
  <span class="vyd-breadcrumb" aria-current="page">Bloco B</span>
</nav>
```

## Pagination · Steps · Kbd (CSS)

```html
<nav class="vyd-pagination">
  <button class="vyd-page">1</button>
  <button class="vyd-page" aria-current="page">2</button>
  <span class="vyd-pagination__ellipsis">…</span>
  <button class="vyd-page">9</button>
</nav>

<div class="vyd-steps">
  <div class="vyd-step vyd-step--done"><span class="vyd-step__marker">✓</span><span class="vyd-step__label">Dados</span></div>
  <div class="vyd-steps__line vyd-steps__line--done"></div>
  <div class="vyd-step vyd-step--current"><span class="vyd-step__marker">2</span><span class="vyd-step__label">Modelo</span></div>
</div>

<span class="vyd-kbd">Ctrl</span> <span class="vyd-kbd">K</span>
```

## Command palette (CSS)

Superfície: `.vyd-cmdk-backdrop` > `.vyd-cmdk` > `__search` (`__input`) + `__list`
(`__item[aria-selected]`, `__empty`). O comportamento (busca/teclado) fica com o app —
ou use o `@vyd/react` abaixo.

## Em React (`@vyd/react`)

```tsx
import { Tabs, Tab, Breadcrumbs, Pagination, Steps, Kbd, CommandPalette } from "@vyd/react";

// Tabs (controlado)
<Tabs>
  <Tab selected icon="info">Visão geral</Tab>
  <Tab onClick={() => go('elem')}>Elementos</Tab>
  <Tab disabled>Histórico</Tab>
</Tabs>

// Breadcrumbs (items → separadores automáticos)
<Breadcrumbs items={[
  { label: 'Obras', icon: 'home', href: '/obras' },
  { label: 'Residencial Aurora', href: '/obras/1' },
  { label: 'Bloco B' },   // último = página atual
]} />

// Pagination (calcula o range com ellipsis)
<Pagination page={2} total={9} onChange={setPage} />

// Steps (marca done/current a partir de `current`)
<Steps current={1} items={['Dados', 'Modelo', 'Revisão', 'Gerar']} />

// Command palette (⌘K) — ↑/↓/Enter/Esc + clique-fora
const [open, setOpen] = useState(false);
<CommandPalette open={open} onClose={() => setOpen(false)} commands={[
  { id: 'model', label: 'Abrir Modelo BIM', icon: 'model', hint: <Kbd>M</Kbd>, onSelect: openModel },
  { id: 'mem', label: 'Gerar Memorial', icon: 'document', keywords: 'pdf documento', onSelect: gen },
]} />
```

## Acessibilidade

- **Tabs**: `role="tablist"/"tab"` + `aria-selected`; associe cada painel com
  `role="tabpanel"` no app.
- **Breadcrumbs**: `<nav aria-label>` + último com `aria-current="page"`.
- **Pagination**: `aria-current="page"` na página ativa; prev/next com `aria-label`.
- **Command palette**: `role="dialog"` + `listbox`/`option`; foco vai ao input ao abrir;
  navegação por teclado e `Esc`/clique-fora fecham.

> Ícones em [ICONS.md](ICONS.md). Demo: [`../demo/nav.html`](../demo/nav.html).
