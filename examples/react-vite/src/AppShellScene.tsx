'use client';

import { useState } from 'react';
import {
  AppShell, TopBar, TopBarBrand, ToolSwitcher, TopBarSpacer, Avatar,
  Ribbon, RibbonGroup, RibbonItem, LeftRail, RailSectionLabel, RailItem,
  Canvas, RightPanel, PanelSectionLabel, Prop, StatusBar, StatusBarSpacer,
  Button, Mono,
} from '@vyd/react';

/**
 * React build of the VYD invariant app shell — the same layout as the design
 * system's demo/index.html, assembled from @vyd/react components consuming
 * @vyd/design-system tokens & classes. No styles defined here.
 */
export function AppShellScene() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AppShell railCollapsed={collapsed}>
      <TopBar>
        <TopBarBrand />
        <ToolSwitcher>Gestão de Obras</ToolSwitcher>
        <TopBarSpacer />
        <Button variant="ghost" onClick={() => setCollapsed((v) => !v)}>Colapsar rail</Button>
        <Button>Publicar</Button>
        <Avatar title="Kleber">K</Avatar>
      </TopBar>

      <Ribbon>
        <RibbonGroup label="Projeto">
          <RibbonItem glyph="▣" label="Modelo" selected />
          <RibbonItem glyph="⬚" label="Níveis" />
        </RibbonGroup>
        <RibbonGroup label="Elementos">
          <RibbonItem glyph="／" label="Parede" />
          <RibbonItem glyph="▭" label="Laje" />
          <RibbonItem glyph="⊞" label="Pilar" />
        </RibbonGroup>
        <RibbonGroup label="Anotar">
          <RibbonItem glyph="↔" label="Cota" />
          <RibbonItem glyph="∠" label="Ângulo" />
          <RibbonItem glyph="⌖" label="Medir" />
        </RibbonGroup>
        <RibbonGroup label="Vista">
          <RibbonItem glyph="⊡" label="2D" />
          <RibbonItem glyph="◫" label="3D" />
          <RibbonItem glyph="⎙" label="Folha" />
        </RibbonGroup>
      </Ribbon>

      <LeftRail>
        <RailSectionLabel>Disciplinas</RailSectionLabel>
        <RailItem current dotColor="var(--vyd-action-primary)">Arquitetura</RailItem>
        <RailItem>Estrutura</RailItem>
        <RailItem>Hidráulica</RailItem>
        <RailItem>Elétrica</RailItem>
        <RailItem>HVAC</RailItem>
        <RailSectionLabel>Vistas</RailSectionLabel>
        <RailItem>Pavimento Térreo</RailItem>
        <RailItem>Pavimento Tipo</RailItem>
        <RailItem>Cobertura</RailItem>
      </LeftRail>

      <Canvas grid>
        <div style={{ minHeight: '100%', display: 'grid', placeItems: 'center', padding: 'var(--vyd-space-9)' }}>
          <div
            style={{
              width: 'min(560px, 80%)',
              aspectRatio: '16 / 10',
              background: 'var(--vyd-bg-panel)',
              border: 'var(--vyd-border-hairline) solid var(--vyd-border-strong)',
              borderRadius: 'var(--vyd-radius-md)',
              boxShadow: 'var(--vyd-shadow-md)',
              display: 'grid',
              gridTemplateRows: '1fr auto',
            }}
          >
            <div style={{ position: 'relative' }}>
              <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" aria-label="Planta esquemática" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <g fill="none" stroke="var(--vyd-border-strong)" strokeWidth="2">
                  <rect x="30" y="24" width="260" height="152" />
                  <line x1="150" y1="24" x2="150" y2="176" />
                  <line x1="150" y1="104" x2="290" y2="104" />
                  <rect x="46" y="40" width="88" height="120" stroke="var(--vyd-border-accent)" />
                </g>
                <g stroke="var(--vyd-text-accent)" strokeWidth="1">
                  <line x1="46" y1="186" x2="134" y2="186" />
                  <line x1="46" y1="182" x2="46" y2="190" />
                  <line x1="134" y1="182" x2="134" y2="190" />
                </g>
                <text x="90" y="200" textAnchor="middle" fill="var(--vyd-text-secondary)" fontFamily="var(--vyd-font-mono)" fontSize="9">4.20 m</text>
              </svg>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--vyd-space-4)',
                padding: 'var(--vyd-space-3) var(--vyd-space-5)',
                borderTop: 'var(--vyd-border-hairline) solid var(--vyd-border-default)',
                fontSize: 'var(--vyd-text-sm)',
                color: 'var(--vyd-text-secondary)',
              }}
            >
              <Mono>Edifício Central</Mono>
              <span>·</span>
              <span>Pavimento Térreo</span>
            </div>
          </div>
        </div>
      </Canvas>

      <RightPanel>
        <PanelSectionLabel>Propriedades</PanelSectionLabel>
        <Prop label="ID">A-103·W12</Prop>
        <Prop label="Tipo">Parede</Prop>
        <Prop label="Nível">+0.000</Prop>
        <Prop label="Comprimento">4.200 m</Prop>
        <Prop label="Altura">2.800 m</Prop>
        <Prop label="Espessura">0.150 m</Prop>
        <Prop label="Material">Alvenaria</Prop>
        <PanelSectionLabel>Ações</PanelSectionLabel>
        <div style={{ padding: 'var(--vyd-space-4) var(--vyd-space-5)', display: 'flex', gap: 'var(--vyd-space-3)' }}>
          <Button>Aplicar</Button>
          <Button variant="ghost">Duplicar</Button>
        </div>
      </RightPanel>

      <StatusBar>
        <span>Pronto</span>
        <span>X <Mono>12.480</Mono>  Y <Mono>8.250</Mono></span>
        <span>Escala <Mono>1:100</Mono></span>
        <StatusBarSpacer />
        <span>Obra: <Mono>Edifício Central</Mono></span>
        <span>Zoom <Mono>100%</Mono></span>
      </StatusBar>
    </AppShell>
  );
}
