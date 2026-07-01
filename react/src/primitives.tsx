import type {
  ButtonHTMLAttributes,
  ElementType,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import { cx } from './cx';

export type ControlSize = 'sm' | 'md' | 'lg';

/**
 * Button — maps to `.vyd-btn` (+ `.vyd-btn--ghost`, `.vyd-btn--sm/--lg`).
 * All native button props pass through (type, onClick, disabled…).
 */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  size?: ControlSize;
};

export function Button({ variant = 'primary', size = 'md', className, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'vyd-btn',
        variant === 'ghost' && 'vyd-btn--ghost',
        size === 'sm' && 'vyd-btn--sm',
        size === 'lg' && 'vyd-btn--lg',
        className,
      )}
      {...rest}
    />
  );
}

/** Input — maps to `.vyd-input` (+ `.vyd-input--sm/--lg`). `size` is the UI size, not the native char count. */
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: ControlSize;
};

export function Input({ size = 'md', className, ...rest }: InputProps) {
  return (
    <input
      className={cx('vyd-input', size === 'sm' && 'vyd-input--sm', size === 'lg' && 'vyd-input--lg', className)}
      {...rest}
    />
  );
}

/** Text — a typographic role (`.vyd-display/title/heading/subheading/body/caption/code`). */
export type TextVariant = 'display' | 'title' | 'heading' | 'subheading' | 'body' | 'caption' | 'code';
export type TextProps = HTMLAttributes<HTMLElement> & {
  variant?: TextVariant;
  /** Element to render (default: span). */
  as?: ElementType;
};

export function Text({ variant = 'body', as, className, ...rest }: TextProps) {
  const Tag = (as ?? 'span') as ElementType;
  return <Tag className={cx(`vyd-${variant}`, className)} {...rest} />;
}

/** Card / panel — maps to `.vyd-card`. */
export type CardProps = HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...rest }: CardProps) {
  return <div className={cx('vyd-card', className)} {...rest} />;
}

/** Mono — tabular-figure monospace span for codes, IDs, dimensions (`.vyd-mono`). */
export function Mono({ className, children, ...rest }: HTMLAttributes<HTMLSpanElement> & { children: ReactNode }) {
  return (
    <span className={cx('vyd-mono', className)} {...rest}>
      {children}
    </span>
  );
}
