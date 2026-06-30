# @vyd/react

Componentes React (wrappers finos) sobre o **VYD Design System**. Não inventam
estilo: cada componente apenas aplica as classes `.vyd-*` que vivem em
`@vyd/design-system`. Assim o React consome a **mesma** fonte de verdade que os
apps em CSS puro / Tailwind — sem tokens paralelos.

## Pré-requisito

O app precisa importar o CSS do design system **uma vez** no root:

```ts
import '@vyd/design-system/theme.css';   // tokens + primitivas (.vyd-btn, .vyd-input…)
import '@vyd/design-system/shell.css';    // layout do app shell (opt-in)
```

## Primitivas

```tsx
import { Button, Input, Card, Mono, CubeMark } from '@vyd/react';

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

## App shell invariante

```tsx
import {
  AppShell, TopBar, TopBarBrand, ToolSwitcher, TopBarSpacer, Avatar,
  Ribbon, RibbonGroup, RibbonItem, LeftRail, RailSectionLabel, RailItem,
  Canvas, RightPanel, PanelSectionLabel, Prop, StatusBar, StatusBarSpacer,
  Button, Mono,
} from '@vyd/react';

<AppShell railCollapsed={collapsed}>
  <TopBar>
    <TopBarBrand />
    <ToolSwitcher>Gestão de Obras</ToolSwitcher>
    <TopBarSpacer />
    <Button variant="ghost" onClick={toggle}>Colapsar rail</Button>
    <Avatar title="Kleber">K</Avatar>
  </TopBar>

  <Ribbon>
    <RibbonGroup label="Projeto">
      <RibbonItem glyph="▣" label="Modelo" selected />
      <RibbonItem glyph="⬚" label="Níveis" />
    </RibbonGroup>
  </Ribbon>

  <LeftRail>
    <RailSectionLabel>Disciplinas</RailSectionLabel>
    <RailItem current>Arquitetura</RailItem>
    <RailItem>Estrutura</RailItem>
  </LeftRail>

  <Canvas grid>{/* a ferramenta */}</Canvas>

  <RightPanel>
    <PanelSectionLabel>Propriedades</PanelSectionLabel>
    <Prop label="ID"><Mono>A-103·W12</Mono></Prop>
  </RightPanel>

  <StatusBar>
    <span>Pronto</span>
    <StatusBarSpacer />
    <span>Zoom <Mono>100%</Mono></span>
  </StatusBar>
</AppShell>
```

Exemplos completos rodando em `examples/react-vite` e `examples/nextjs`.
