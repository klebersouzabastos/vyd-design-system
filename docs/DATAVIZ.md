# VYD — Data-viz

Paleta de dados + gráficos leves (sem dependência) para dados de engenharia.
Adicionado na **v0.10.0**.

## Paleta (tokens)

- **Categórica** — `--vyd-viz-1` … `--vyd-viz-6`: azul, teal, âmbar, verde, vermelho,
  aço. Distinguível no escuro, sóbria, ancorada em azul (sem roxo). Use na ordem para
  séries.
- **Sequencial** — `--vyd-viz-seq-1` … `--vyd-viz-seq-5`: tints blueprint (claro→escuro)
  para heatmap/escala.

Tailwind: `bg-viz-1`, `text-viz-3`, `bg-viz-seq-2`… No React, `vizColor(i)` retorna a
cor categórica ciclando (`var(--vyd-viz-…)`).

## Componentes (CSS)

- `.vyd-legend` (+ `__item`, `__swatch`) — legenda de séries.
- `.vyd-barchart` (+ `__col`, `__track`, `__bar`, `__val`, `__label`) — bar chart
  responsivo, só com CSS.
- Helpers de SVG: `.vyd-chart`, `.vyd-chart-grid`, `.vyd-chart-axis`.

```html
<div class="vyd-barchart" style="height:180px">
  <div class="vyd-barchart__col">
    <span class="vyd-barchart__val">318</span>
    <div class="vyd-barchart__track"><div class="vyd-barchart__bar" style="height:52%;background:var(--vyd-viz-1)"></div></div>
    <span class="vyd-barchart__label">P-12</span>
  </div>
</div>
```

## Em React (`vyd-react`) — gráficos SVG sem dependência

```tsx
import { BarChart, LineChart, Sparkline, Gauge, Legend, vizColor } from "vyd-react";

<BarChart height={180} showValues data={[
  { label: 'P-12', value: 318 }, { label: 'F-B', value: 612 },
]} />

<LineChart height={160} area series={[
  { name: 'Executado', points: [50, 70, 65, 105, 100, 135] },
  { name: 'Previsto',  points: [20, 30, 40, 50, 65, 75] },
]} />

<Gauge value={87} size={120} />           {/* anel radial com % no centro */}
<Sparkline points={[4, 8, 6, 16, 14, 24, 26]} />

<Legend items={[{ label: 'Pilares' }, { label: 'Fundação', color: vizColor(3) }]} />
```

`BarChart` é CSS/divs (responsivo); `LineChart`/`Sparkline`/`Gauge` são **SVG** com
`vector-effect="non-scaling-stroke"` (traço crisp em qualquer largura). As cores saem
dos tokens `--vyd-viz-*`.

## Notas & acessibilidade

- **Nunca** dependa só de cor: rotule séries (legenda, eixos) e use ordem/forma quando
  possível. A paleta categórica é distinguível, mas legendas são obrigatórias.
- Para gráficos complexos (muitas séries, interação, tooltips ricos), use uma lib
  (ex.: visx/Recharts) **consumindo os tokens** via `dist/tokens.resolved.json` — a
  identidade continua VYD.
- Números em `--vyd-font-mono` com algarismos tabulares (já aplicado nos rótulos).

> Fundações de cor em [FOUNDATIONS.md](FOUNDATIONS.md). Demo:
> [`../demo/dataviz.html`](../demo/dataviz.html).
