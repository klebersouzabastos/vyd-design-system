# vyd-react

Componentes React (wrappers finos) sobre o **VYD Design System**. Não inventam
estilo: cada componente apenas aplica as classes `.vyd-*` que vivem em
`vyd-design-system`. Assim o React consome a **mesma** fonte de verdade que os
apps em CSS puro / Tailwind — sem tokens paralelos.

## Instalação

```bash
npm install vyd-react vyd-design-system
```

Peers: `react`, `react-dom`, `vyd-design-system`. Distribuído compilado (JS ESM +
tipos `.d.ts`), com `'use client'` preservado nos componentes interativos → funciona
em **Next.js (App Router)** e **Vite**.

## Pré-requisito

O app precisa importar o CSS do design system **uma vez** no root (o `vyd-react`
**não** importa CSS — ele só aplica as classes):

```ts
import 'vyd-design-system/theme.css';   // tokens + primitivas (.vyd-btn, .vyd-input…)
import 'vyd-design-system/shell.css';    // layout do app shell (opt-in)
```

## Primitivas

```tsx
import { Button, Input, Card, Mono, CubeMark } from 'vyd-react';

<CubeMark size={32} variant="positive" />      {/* símbolo oficial */}
<Button>Salvar</Button>
<Button variant="ghost">Cancelar</Button>
<Input placeholder="Buscar…" />
<Card>Conteúdo do painel</Card>
<Mono>VYD-OBR-0421</Mono>
```

`Button`/`Input` repassam todas as props nativas (`onClick`, `disabled`, `type`,
`value`…) e **aceitam `ref`** (todos os primitivos usam `forwardRef`). Em Next.js
(App Router), use-os dentro de um componente `'use client'` quando precisar de
handlers.

### `asChild` (composição sem wrapper)

`Button` aceita `asChild` para aplicar o estilo VYD a outro elemento (ex.: `Link`
do Next), sem `<button>` extra no DOM:

```tsx
<Button asChild variant="ghost">
  <a href="/obras">Ver obras</a>
</Button>
```

### `Field` injeta ARIA automaticamente

Dentro de `Field`, os controles VYD (`Input`, `Textarea`, `Select`) recebem `id`,
`aria-describedby` (hint/erro), `aria-invalid` e `aria-required` sem você ligar
nada à mão — props explícitas sempre vencem:

```tsx
<Field label="Cota" help="metros" error={erro} required>
  <Input value={cota} onChange={…} />   {/* já sai com id + aria-* corretos */}
</Field>
```

### Menu / Popover (motor Base UI, encapsulado)

Posicionamento, teclado (setas/ESC), click-fora e portal vêm do
[Base UI](https://base-ui.com) — mas a API é do VYD e as classes continuam
`.vyd-*`. Modo controlado opcional:

```tsx
<Menu open={open} onOpenChange={setOpen} trigger={<Button>Ações</Button>}>
  <MenuItem onClick={…}>Duplicar</MenuItem>
  <MenuItem danger>Excluir</MenuItem>
</Menu>
```

### Tabs controladas + TabPanel

```tsx
<TabsRoot value={tab} onChange={setTab}>
  <Tabs aria-label="Seções">
    <Tab value="geral">Geral</Tab>
    <Tab value="estrutura">Estrutura</Tab>
  </Tabs>
  <TabPanel value="geral">…</TabPanel>
  <TabPanel value="estrutura">…</TabPanel>
</TabsRoot>
```

Setas ←/→, Home/End e `aria-controls` já funcionam (WAI-ARIA Tabs). A API antiga
(`<Tab selected onClick>`) continua válida.

### CommandPalette

Roda sobre `<dialog>` nativo (focus-trap/ESC/inert do browser) com
`role="combobox"` + `aria-activedescendant` no input — leitores de tela anunciam
o item ativo enquanto você navega com as setas.

## App shell invariante (ribbon-only)

🔴 **Regra dura:** navegação é SEMPRE a ribbon no topo. **Sem menu lateral esquerdo e
sem painéis laterais** — o canvas ocupa a largura toda. Listas/inspetores/propriedades
são conteúdo DENTRO do `Canvas`. (Não existem `LeftRail`/`RightPanel` — foram removidos
na v2. Ver [`../AGENTS.md`](../AGENTS.md).)

```tsx
import {
  AppShell, TopBar, TopBarBrand, ToolSwitcher, TopBarSpacer, Avatar,
  RibbonTabs, RibbonTab, Ribbon, RibbonGroup, RibbonItem,
  Canvas, StatusBar, StatusBarSpacer, Card, Mono,
} from 'vyd-react';

<AppShell>
  <TopBar>
    <TopBarBrand />
    <ToolSwitcher>Gestão de Obras</ToolSwitcher>
    <TopBarSpacer />
    <Avatar title="Kleber">K</Avatar>
  </TopBar>

  <RibbonTabs>
    <RibbonTab selected>Início</RibbonTab>
    <RibbonTab>Modelagem</RibbonTab>
    <RibbonTab>Documentos</RibbonTab>
  </RibbonTabs>

  <Ribbon>
    <RibbonGroup label="Projeto">
      <RibbonItem glyph="▣" label="Modelo" selected />
      <RibbonItem glyph="⬚" label="Níveis" />
    </RibbonGroup>
  </Ribbon>

  <Canvas grid>
    {/* a ferramenta, em largura cheia. Inspetores/listas vão AQUI (ex.: um Card). */}
    <Card>
      <Mono>A-103·W12</Mono>
    </Card>
  </Canvas>

  <StatusBar>
    <span>Pronto</span>
    <StatusBarSpacer />
    <span>Zoom <Mono>100%</Mono></span>
  </StatusBar>
</AppShell>
```

O app shell montado (referência) está em `demo/index.html`.
