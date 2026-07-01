import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';
import { Icon, type IconName } from './Icon';

export type FeedbackVariant = 'info' | 'success' | 'warning' | 'danger';

const VARIANT_ICON: Record<FeedbackVariant, IconName> = {
  info: 'info',
  success: 'check',
  warning: 'alert-triangle',
  danger: 'alert-triangle',
};

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  variant?: FeedbackVariant;
  title?: ReactNode;
  onClose?: () => void;
};

function Notice(base: 'vyd-alert' | 'vyd-toast') {
  return function Component({ variant = 'info', title, onClose, className, children, ...rest }: AlertProps) {
    return (
      <div
        className={cx(base, variant !== 'info' && `${base}--${variant}`, className)}
        role={variant === 'danger' ? 'alert' : 'status'}
        {...rest}
      >
        <Icon name={VARIANT_ICON[variant]} className="vyd-alert__icon" />
        <div className="vyd-alert__body">
          {title != null ? <span className="vyd-alert__title">{title}</span> : null}
          {children != null ? <span className="vyd-alert__text">{children}</span> : null}
        </div>
        {onClose ? (
          <button className="vyd-alert__close" type="button" aria-label="Fechar" onClick={onClose}>
            <Icon name="close" size="sm" />
          </button>
        ) : null}
      </div>
    );
  };
}

/** Alert / banner inline (`.vyd-alert`). */
export const Alert = Notice('vyd-alert');
/** Toast individual (`.vyd-toast`) — coloque dentro de <Toaster>. */
export const Toast = Notice('vyd-toast');

/** Região viva das notificações (`.vyd-toaster`, aria-live). */
export function Toaster({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('vyd-toaster', className)} role="region" aria-live="polite" aria-label="Notificações" {...rest}>
      {children}
    </div>
  );
}

/** Progress linear (`.vyd-progress`). `value` 0–100; `indeterminate` para desconhecido. */
export type ProgressProps = HTMLAttributes<HTMLDivElement> & { value?: number; indeterminate?: boolean };
export function Progress({ value = 0, indeterminate = false, className, ...rest }: ProgressProps) {
  return (
    <div
      className={cx('vyd-progress', indeterminate && 'vyd-progress--indeterminate', className)}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <div className="vyd-progress__bar" style={indeterminate ? undefined : { width: `${value}%` }} />
    </div>
  );
}

/** Spinner (`.vyd-spinner`). */
export function Spinner({ size = 'md', className, ...rest }: HTMLAttributes<HTMLSpanElement> & { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <span
      className={cx('vyd-spinner', size === 'sm' && 'vyd-spinner--sm', size === 'lg' && 'vyd-spinner--lg', className)}
      role="status"
      aria-label="Carregando"
      {...rest}
    />
  );
}

/** Skeleton placeholder (`.vyd-skeleton`). */
export function Skeleton({
  width,
  height,
  className,
  style,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { width?: string | number; height?: string | number }) {
  return <span className={cx('vyd-skeleton', className)} aria-hidden="true" style={{ width, height, ...style }} {...rest} />;
}

/** Empty state (`.vyd-empty`). */
export type EmptyStateProps = {
  icon?: IconName;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cx('vyd-empty', className)}>
      {icon ? <span className="vyd-empty__icon"><Icon name={icon} /></span> : null}
      <span className="vyd-empty__title">{title}</span>
      {description != null ? <span className="vyd-empty__text">{description}</span> : null}
      {action}
    </div>
  );
}

/** Badge (`.vyd-badge`). `dot` para status sem número. */
export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  dot?: boolean;
};
export function Badge({ variant = 'neutral', dot = false, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cx('vyd-badge', variant !== 'neutral' && `vyd-badge--${variant}`, dot && 'vyd-badge--dot', className)}
      {...rest}
    >
      {dot ? null : children}
    </span>
  );
}

/** Tag / chip (`.vyd-tag`). `onRemove` mostra o botão de fechar. */
export type TagProps = HTMLAttributes<HTMLSpanElement> & { accent?: boolean; onRemove?: () => void };
export function Tag({ accent = false, onRemove, className, children, ...rest }: TagProps) {
  return (
    <span className={cx('vyd-tag', accent && 'vyd-tag--accent', className)} {...rest}>
      {children}
      {onRemove ? (
        <button className="vyd-tag__close" type="button" aria-label="Remover" onClick={onRemove}>
          <Icon name="close" size="sm" />
        </button>
      ) : null}
    </span>
  );
}
