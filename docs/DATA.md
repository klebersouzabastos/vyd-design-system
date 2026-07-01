# VYD — Dados densos

Componentes para exibir dados de engenharia com densidade: table/data-grid, list,
tree, stat/KPI e key-value. Adicionado na **v0.8.0**. Importe `vyd-design-system/theme.css`.

## Table / data-grid

Envolva a tabela em `.vyd-table-wrap` (scroll + **header sticky**). Modificadores:
`--zebra`, `--compact`. Coluna numérica: classe `.vyd-num` (alinha à direita, mono
tabular). Linha selecionada: `aria-selected="true"`. Ordenável: botão
`.vyd-table__sort` com `aria-sort`.

```html
<div class="vyd-table-wrap" style="max-height:320px">
  <table class="vyd-table vyd-table--zebra">
    <thead><tr>
      <th><button class="vyd-table__sort" aria-sort="ascending">Elemento
        <svg class="vyd-icon vyd-icon--sm"><use href="#vyd-icon-chevron-up"/></svg></button></th>
      <th class="vyd-num">Volume</th>
      <th>Status</th>
    </tr></thead>
    <tbody>
      <tr aria-selected="true"><td>P-12</td><td class="vyd-num">318,4</td>
        <td><span class="vyd-badge vyd-badge--success">Aprovado</span></td></tr>
    </tbody>
  </table>
</div>
```

## List · Tree · Stat · Key-value

```html
<!-- List -->
<div class="vyd-list">
  <div class="vyd-list__item" aria-selected="true">
    <svg class="vyd-icon vyd-list__icon"><use href="#vyd-icon-document"/></svg>
    <div class="vyd-list__body"><span class="vyd-list__title">Memorial</span>
      <span class="vyd-list__sub">12 páginas</span></div>
    <span class="vyd-list__trailing vyd-mono">2 min</span>
  </div>
</div>

<!-- Tree (indentação por padding; chevron gira via aria-expanded) -->
<div class="vyd-tree">
  <div class="vyd-tree__item" aria-expanded="true">
    <button class="vyd-tree__toggle"><svg class="vyd-icon vyd-icon--sm"><use href="#vyd-icon-chevron-right"/></svg></button>
    <svg class="vyd-icon vyd-icon--sm vyd-tree__icon"><use href="#vyd-icon-structure"/></svg> Bloco B
  </div>
</div>

<!-- Stat/KPI -->
<div class="vyd-stat"><span class="vyd-stat__label">Progresso</span>
  <span class="vyd-stat__value">87,5%</span>
  <span class="vyd-stat__delta vyd-stat__delta--up">+4,2%</span></div>

<!-- Key-value -->
<div class="vyd-kv">
  <span class="vyd-kv__key">Seção</span><span class="vyd-kv__val">30×60</span>
  <span class="vyd-kv__key">fck</span><span class="vyd-kv__val">30 MPa</span>
</div>
```

## Em React (`vyd-react`)

```tsx
import { TableWrap, Table, Thead, Tbody, Tr, Th, Td, Badge,
         List, ListItem, Tree, TreeItem, Stat, KeyValue, KV } from "vyd-react";

<TableWrap style={{ maxHeight: 320 }}>
  <Table zebra>
    <Thead><Tr>
      <Th sortable sortDir="asc" onSort={sortByName}>Elemento</Th>
      <Th numeric>Volume</Th>
      <Th>Status</Th>
    </Tr></Thead>
    <Tbody>
      {rows.map(r => (
        <Tr key={r.id} selected={r.id === sel}>
          <Td>{r.name}</Td>
          <Td numeric>{r.volume}</Td>
          <Td><Badge variant="success">Aprovado</Badge></Td>
        </Tr>
      ))}
    </Tbody>
  </Table>
</TableWrap>

<List>
  <ListItem icon="document" title="Memorial" subtitle="12 páginas" trailing="2 min" selected />
</List>

<Tree>
  <TreeItem level={0} icon="structure" label="Bloco B" expanded onToggle={t} />
  <TreeItem level={1} icon="layers" label="Térreo" expanded onToggle={t} />
  <TreeItem level={2} icon="column" label="Pilar P-12" leaf selected />
</Tree>

<Stat label="Progresso" value="87,5%" delta="+4,2%" trend="up" />

<KeyValue>
  <KV k="Seção">30×60</KV>
  <KV k="fck">30 MPa</KV>
</KeyValue>
```

## Notas

- **Table** é a superfície estilizada; **dados, ordenação e seleção são do app**. `Th`
  ordenável expõe `aria-sort` + callback `onSort`; `Tr selected` → `aria-selected`.
- Use `numeric`/`.vyd-num` para cotas/volumes/IDs — alinhamento à direita e algarismos
  tabulares (leitura em coluna).
- **Tree** controla expandir/selecionar via props (`expanded`/`onToggle`/`selected`); a
  indentação vem do `level`.
- Para muitas linhas (10k+), vireie a lista (ex.: TanStack Virtual) — a estilização VYD
  continua a mesma.

> Ícones em [ICONS.md](ICONS.md); status em [FEEDBACK.md](FEEDBACK.md) (badge/tag).
> Demo: [`../demo/data.html`](../demo/data.html).
