'use client';

import { forwardRef, useId } from 'react';
import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cx } from './cx';
import type { ControlSize } from './primitives';
import { Icon } from './Icon';
import { FieldContext, useFieldControlProps } from './field-context';

/**
 * Field — label + controle + ajuda/erro (`.vyd-field`).
 * Passe o controle como children. `error` substitui `help` e vira role="alert".
 * Wiring ARIA automático (useId): o label aponta para o controle e o controle
 * ganha aria-describedby (help/erro) + aria-invalid/aria-required — quando o
 * controle é um componente VYD. `htmlFor` explícito continua suportado.
 */
export type FieldProps = {
  label?: ReactNode;
  required?: boolean;
  help?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
};

export function Field({ label, required, help, error, htmlFor, className, children }: FieldProps) {
  const auto = useId();
  const controlId = htmlFor ?? `vyd-field-${auto}`;
  const descId = `vyd-field-desc-${auto}`;
  const hasDesc = help != null || error != null;
  return (
    <FieldContext.Provider
      value={{ controlId, describedBy: hasDesc ? descId : undefined, invalid: error != null, required }}
    >
      <div className={cx('vyd-field', className)}>
        {label != null && (
          <label className="vyd-field__label" htmlFor={controlId}>
            {label}
            {required ? <span className="vyd-field__req" aria-hidden="true">*</span> : null}
          </label>
        )}
        {children}
        {help != null && error == null ? (
          <span className="vyd-field__help" id={descId}>{help}</span>
        ) : null}
        {error != null ? (
          <span className="vyd-field__error" role="alert" id={descId}>{error}</span>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

/** Input — `.vyd-input` (+ --sm/--lg). Client: consome o FieldContext p/ ARIA. */
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  size?: ControlSize;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', className, ...rest },
  ref,
) {
  const fieldProps = useFieldControlProps(rest);
  return (
    <input
      ref={ref}
      className={cx('vyd-input', size === 'sm' && 'vyd-input--sm', size === 'lg' && 'vyd-input--lg', className)}
      {...fieldProps}
    />
  );
});

/** Textarea (`.vyd-textarea`). */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    const fieldProps = useFieldControlProps(rest);
    return <textarea ref={ref} className={cx('vyd-textarea', className)} {...fieldProps} />;
  },
);

/** Native select estilizado (`.vyd-select`). */
export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...rest }, ref) {
    const fieldProps = useFieldControlProps(rest);
    return (
      <select ref={ref} className={cx('vyd-select', className)} {...fieldProps}>
        {children}
      </select>
    );
  },
);

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/** Checkbox (`.vyd-checkbox`). */
export const Checkbox = forwardRef<HTMLInputElement, ToggleProps>(function Checkbox({ className, ...rest }, ref) {
  return <input ref={ref} type="checkbox" className={cx('vyd-checkbox', className)} {...rest} />;
});

/** Radio (`.vyd-radio`). */
export const Radio = forwardRef<HTMLInputElement, ToggleProps>(function Radio({ className, ...rest }, ref) {
  return <input ref={ref} type="radio" className={cx('vyd-radio', className)} {...rest} />;
});

/** Switch (`.vyd-switch`) — checkbox com role="switch". */
export const Switch = forwardRef<HTMLInputElement, ToggleProps>(function Switch({ className, ...rest }, ref) {
  return <input ref={ref} type="checkbox" role="switch" className={cx('vyd-switch', className)} {...rest} />;
});

/** Range/slider (`.vyd-range`). */
export const Range = forwardRef<HTMLInputElement, ToggleProps>(function Range({ className, ...rest }, ref) {
  return <input ref={ref} type="range" className={cx('vyd-range', className)} {...rest} />;
});

/** Label + controle inline (`.vyd-choice`) — para checkbox/radio/switch. */
export function Choice({ className, children, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cx('vyd-choice', className)} {...rest}>
      {children}
    </label>
  );
}

/** Input com ícone à esquerda (`.vyd-input-group`). */
export function InputGroup({ icon, className, children }: { icon: ReactNode; className?: string; children: ReactNode }) {
  return (
    <div className={cx('vyd-input-group', className)}>
      {icon}
      {children}
    </div>
  );
}

/** Atalho: input de busca (ícone search + input). */
export const SearchInput = forwardRef<HTMLInputElement, InputProps>(function SearchInput({ className, ...rest }, ref) {
  return (
    <InputGroup icon={<Icon name="search" />}>
      <Input ref={ref} className={className} {...rest} />
    </InputGroup>
  );
});
