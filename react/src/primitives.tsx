import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import { cx } from './cx';

/**
 * Button — maps to `.vyd-btn` (+ `.vyd-btn--ghost`).
 * All native button props pass through (type, onClick, disabled…).
 */
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export function Button({ variant = 'primary', className, type = 'button', ...rest }: ButtonProps) {
  return <button type={type} className={cx('vyd-btn', variant === 'ghost' && 'vyd-btn--ghost', className)} {...rest} />;
}

/** Input — maps to `.vyd-input`. */
export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: InputProps) {
  return <input className={cx('vyd-input', className)} {...rest} />;
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
