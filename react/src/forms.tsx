import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { cx } from './cx';
import { Input, type InputProps } from './primitives';
import { Icon } from './Icon';

/**
 * Field — label + controle + ajuda/erro (`.vyd-field`).
 * Passe o controle como children. `error` substitui `help` e vira role="alert".
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
  return (
    <div className={cx('vyd-field', className)}>
      {label != null && (
        <label className="vyd-field__label" htmlFor={htmlFor}>
          {label}
          {required ? <span className="vyd-field__req" aria-hidden="true">*</span> : null}
        </label>
      )}
      {children}
      {help != null && error == null ? <span className="vyd-field__help">{help}</span> : null}
      {error != null ? <span className="vyd-field__error" role="alert">{error}</span> : null}
    </div>
  );
}

/** Textarea (`.vyd-textarea`). */
export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx('vyd-textarea', className)} {...rest} />;
}

/** Native select estilizado (`.vyd-select`). */
export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx('vyd-select', className)} {...rest}>
      {children}
    </select>
  );
}

type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/** Checkbox (`.vyd-checkbox`). */
export function Checkbox({ className, ...rest }: ToggleProps) {
  return <input type="checkbox" className={cx('vyd-checkbox', className)} {...rest} />;
}

/** Radio (`.vyd-radio`). */
export function Radio({ className, ...rest }: ToggleProps) {
  return <input type="radio" className={cx('vyd-radio', className)} {...rest} />;
}

/** Switch (`.vyd-switch`) — checkbox com role="switch". */
export function Switch({ className, ...rest }: ToggleProps) {
  return <input type="checkbox" role="switch" className={cx('vyd-switch', className)} {...rest} />;
}

/** Range/slider (`.vyd-range`). */
export function Range({ className, ...rest }: ToggleProps) {
  return <input type="range" className={cx('vyd-range', className)} {...rest} />;
}

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
export function SearchInput({ className, ...rest }: InputProps) {
  return (
    <InputGroup icon={<Icon name="search" />}>
      <Input className={className} {...rest} />
    </InputGroup>
  );
}
