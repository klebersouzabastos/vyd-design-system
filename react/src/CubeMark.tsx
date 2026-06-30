/**
 * VYD symbol — the official isometric cube (wireframe + highlighted top face).
 * Geometry matches brand/vyd-symbol.svg exactly.
 *
 * variant:
 *   "positive"  — on dark chrome (default): edges blueprint-300, top blueprint-500
 *   "negative"  — on light backgrounds: edges blueprint-700, inner neutral-light
 *   "mono"      — single colour via currentColor (inherits `color`)
 */
export type CubeVariant = 'positive' | 'negative' | 'mono';

export type CubeMarkProps = {
  size?: number;
  variant?: CubeVariant;
  title?: string;
};

const HEX = {
  positive: { outer: '#6B9CE0', top: '#1E5FC4', inner: '#3A4350', innerOpacity: 1 },
  negative: { outer: '#143F86', top: '#1E5FC4', inner: '#A9B4BF', innerOpacity: 1 },
} as const;

export function CubeMark({ size = 32, variant = 'positive', title }: CubeMarkProps) {
  const mono = variant === 'mono';
  const c = mono ? null : HEX[variant];
  const outer = mono ? 'currentColor' : c!.outer;
  const top = mono ? 'currentColor' : c!.top;
  const inner = mono ? 'currentColor' : c!.inner;
  const innerOpacity = mono ? 0.5 : 1;

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {title ? <title>{title}</title> : null}
      <path d="M16 3 L28 10 L28 22 L16 29 L4 22 L4 10 Z" fill="none" stroke={outer} strokeWidth="1.5" strokeLinejoin="miter" />
      <path d="M16 3 L28 10 L16 16 L4 10 Z" fill={top} />
      <path d="M16 16 L16 29 M16 16 L28 10 M16 16 L4 10" fill="none" stroke={inner} strokeWidth="1" opacity={innerOpacity} />
    </svg>
  );
}
