import type { SVGAttributes } from 'react';
import { ICONS, type IconName } from './icons.generated';
import { cx } from './cx';

export type { IconName };
export type { ControlSize } from './primitives';

export type IconProps = Omit<SVGAttributes<SVGElement>, 'name'> & {
  name: IconName;
  size?: 'sm' | 'md' | 'lg';
  /** Accessible label. Omit for decorative icons (aria-hidden). */
  title?: string;
};

/**
 * VYD icon rendered inline (no external sprite needed): herda a cor via
 * currentColor e o tamanho pelos tokens (.vyd-icon). Nomes em `IconName`.
 */
export function Icon({ name, size = 'md', title, className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx('vyd-icon', size === 'sm' && 'vyd-icon--sm', size === 'lg' && 'vyd-icon--lg', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : '') + ICONS[name] }}
      {...rest}
    />
  );
}
