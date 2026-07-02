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
`value`…). Em Next.js (App Router), use-os dentro de um componente `'use client'`
quando precisar de handlers.

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
