import type { ReactNode } from 'react';
import { cx } from './cx';

/** Cor categórica da paleta de dados (cicla em --vyd-viz-1..6). */
export function vizColor(i: number): string {
  return `var(--vyd-viz-${(((i % 6) + 6) % 6) + 1})`;
}

/* ---- Legend ---- */
export function Legend({ items, className }: { items: { label: ReactNode; color?: string }[]; className?: string }) {
  return (
    <div className={cx('vyd-legend', className)}>
      {items.map((it, i) => (
        <span className="vyd-legend__item" key={i}>
          <span className="vyd-legend__swatch" style={{ background: it.color ?? vizColor(i) }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

/* ---- Bar chart (CSS/divs, responsivo) ---- */
export type BarDatum = { label: ReactNode; value: number; color?: string };
export function BarChart({
  data,
  height = 160,
  showValues = false,
  className,
  label = 'Gráfico de barras',
}: {
  data: BarDatum[];
  height?: number;
  showValues?: boolean;
  className?: string;
  /** Rótulo acessível do gráfico (role="img"). */
  label?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className={cx('vyd-barchart', className)} style={{ height }} role="img" aria-label={label}>
      {data.map((d, i) => (
        <div className="vyd-barchart__col" key={i}>
          {showValues ? <span className="vyd-barchart__val">{d.value}</span> : null}
          <div className="vyd-barchart__track">
            <div
              className="vyd-barchart__bar"
              style={{ height: `${(d.value / max) * 100}%`, background: d.color ?? vizColor(i) }}
              title={`${String(d.label)}: ${d.value}`}
            />
          </div>
          <span className="vyd-barchart__label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---- Line chart (SVG) ---- */
export type Series = { name?: string; color?: string; points: number[] };
export function LineChart({
  series,
  height = 160,
  area = false,
  grid = true,
  className,
  label = 'Gráfico de linhas',
}: {
  series: Series[];
  height?: number;
  area?: boolean;
  grid?: boolean;
  className?: string;
  label?: string;
}) {
  const all = series.flatMap((s) => s.points);
  const max = Math.max(...all, 0);
  const min = Math.min(...all, 0);
  const span = max - min || 1;
  const W = 100;
  const len = Math.max(...series.map((s) => s.points.length), 1);
  const xx = (i: number) => (len <= 1 ? 0 : (i / (len - 1)) * W);
  const yy = (v: number) => height - ((v - min) / span) * height;
  return (
    <svg
      className={cx('vyd-chart', className)}
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="none"
      width="100%"
      height={height}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      {grid
        ? [0, 0.25, 0.5, 0.75, 1].map((g, i) => (
            <line key={i} className="vyd-chart-grid" x1={0} x2={W} y1={g * height} y2={g * height} vectorEffect="non-scaling-stroke" />
          ))
        : null}
      {series.map((s, si) => {
        const pts = s.points.map((v, i) => `${xx(i)},${yy(v)}`).join(' ');
        const color = s.color ?? vizColor(si);
        return (
          <g key={si}>
            {area ? <polygon points={`0,${height} ${pts} ${W},${height}`} fill={color} fillOpacity={0.12} /> : null}
            <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </g>
        );
      })}
    </svg>
  );
}

/* ---- Sparkline (SVG mini) ---- */
export function Sparkline({
  points,
  width = 100,
  height = 28,
  color,
  className,
  label = 'Tendência',
}: {
  points: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
  label?: string;
}) {
  const max = Math.max(...points, 0);
  const min = Math.min(...points, 0);
  const span = max - min || 1;
  const len = points.length;
  const pts = points.map((v, i) => `${len <= 1 ? 0 : (i / (len - 1)) * width},${height - ((v - min) / span) * height}`).join(' ');
  return (
    <svg className={cx('vyd-chart', className)} viewBox={`0 0 ${width} ${height}`} width={width} height={height} preserveAspectRatio="none" role="img" aria-label={label}>
      <title>{label}</title>
      <polyline points={pts} fill="none" stroke={color ?? vizColor(0)} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ---- Gauge (SVG ring) ---- */
export function Gauge({
  value,
  size = 120,
  label,
  color = 'var(--vyd-action-primary)',
  className,
}: {
  value: number;
  size?: number;
  label?: ReactNode;
  color?: string;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = 42;
  const C = 2 * Math.PI * r;
  const dash = (v / 100) * C;
  return (
    <div className={cx('vyd-gauge', className)} style={{ width: size, height: size, position: 'relative' }} role="img" aria-label={`${Math.round(v)}%`}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={50} cy={50} r={r} fill="none" stroke="var(--vyd-bg-elevated)" strokeWidth={8} />
        <circle cx={50} cy={50} r={r} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={`${dash} ${C}`} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <span className="vyd-stat__value" style={{ fontSize: 'var(--vyd-text-xl)' }}>
          {label ?? `${Math.round(v)}%`}
        </span>
      </div>
    </div>
  );
}
