import { forwardRef } from 'react';
import type {
  ButtonHTMLAttributes,
  ElementType,
  HTMLAttributes,
  ReactNode,
} from 'react';
import { cx } from './cx';
import { Slot } from './Slot';

export type ControlSize = 'sm' | 'md' | 'lg';

/**
 * Button — maps to `.vyd-btn` (+ `.vyd-btn--ghost`, `.vyd-btn--sm/--lg`).
 * All native button props pass through (type, onClick, disabled…).
 * `asChild`: funde o visual/props no filho (ex.: <Button asChild><a href/></Button>).
 */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
  size?: ControlSize;
  asChild?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', className, type = 'button', asChild, children, ...rest },
  ref,
) {
  const cls = cx(
    'vyd-btn',
    variant === 'ghost' && 'vyd-btn--ghost',
    size === 'sm' && 'vyd-btn--sm',
    size === 'lg' && 'vyd-btn--lg',
    className,
  );
  if (asChild) {
    return (
      <Slot className={cls} {...(rest as HTMLAttributes<HTMLElement>)}>
        {children}
      </Slot>
    );
  }
  return (
    <button ref={ref} type={type} className={cls} {...rest}>
      {children}
    </button>
  );
});

/** Text — a typographic role (`.vyd-display/title/heading/subheading/body/caption/code`). */
export type TextVariant = 'display' | 'title' | 'heading' | 'subheading' | 'body' | 'caption' | 'code';
export type TextProps = HTMLAttributes<HTMLElement> & {
  variant?: TextVariant;
  /** Element to render (default: span). */
  as?: ElementType;
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { variant = 'body', as, className, ...rest },
  ref,
) {
  const Tag = (as ?? 'span') as ElementType;
  return <Tag ref={ref} className={cx(`vyd-${variant}`, className)} {...rest} />;
});

/** Card / panel — maps to `.vyd-card`. */
export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({ className, ...rest }, ref) {
  return <div ref={ref} className={cx('vyd-card', className)} {...rest} />;
});

/** Mono — tabular-figure monospace span for codes, IDs, dimensions (`.vyd-mono`). */
export const Mono = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement> & { children: ReactNode }>(
  function Mono({ className, children, ...rest }, ref) {
    return (
      <span ref={ref} className={cx('vyd-mono', className)} {...rest}>
        {children}
      </span>
    );
  },
);
