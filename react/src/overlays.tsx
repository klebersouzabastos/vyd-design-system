'use client';

import { isValidElement, useEffect, useId, useRef } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { Menu as BaseMenu } from '@base-ui-components/react/menu';
import { Popover as BasePopover } from '@base-ui-components/react/popover';
import { cx } from './cx';
import { Icon, type IconName } from './Icon';

/* =====================================================================
   Dialog / Drawer — <dialog> nativo (foco-trap, ESC e backdrop de graça).
   ===================================================================== */

export function useNativeDialog(open: boolean, onClose?: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onCancel = (e: Event) => {
      e.preventDefault(); // ESC -> deixa o React fechar via onClose
      onClose?.();
    };
    d.addEventListener('cancel', onCancel);
    return () => d.removeEventListener('cancel', onCancel);
  }, [onClose]);
  return ref;
}

export type DialogProps = {
  open: boolean;
  onClose?: () => void;
  title?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function Dialog({ open, onClose, title, footer, className, children }: DialogProps) {
  const ref = useNativeDialog(open, onClose);
  return (
    <dialog
      ref={ref}
      className={cx('vyd-dialog', className)}
      onClick={(e) => {
        if (e.target === ref.current) onClose?.(); // clique no backdrop
      }}
    >
      {title != null || onClose ? (
        <div className="vyd-dialog__head">
          {title != null ? <span className="vyd-dialog__title">{title}</span> : <span />}
          {onClose ? (
            <button type="button" className="vyd-dialog__close" aria-label="Fechar" onClick={onClose}>
              <Icon name="close" />
            </button>
          ) : null}
        </div>
      ) : null}
      <div className="vyd-dialog__body">{children}</div>
      {footer != null ? <div className="vyd-dialog__foot">{footer}</div> : null}
    </dialog>
  );
}

export type DrawerProps = DialogProps & { side?: 'right' | 'left' | 'bottom' };

export function Drawer({ side = 'right', className, ...rest }: DrawerProps) {
  return <Dialog className={cx('vyd-drawer', `vyd-drawer--${side}`, className)} {...rest} />;
}

/* =====================================================================
   Menu / Popover — motor Base UI (WAI-ARIA completo: setas, typeahead,
   foco gerenciado, aria-haspopup/expanded, light-dismiss, reposição).
   O Base UI é DETALHE INTERNO: a API pública é do VYD (não re-exportamos
   tipos) e o visual continua vindo das classes .vyd-*.
   ===================================================================== */

type FloatingProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'end';
  className?: string;
  /** Controlado (opcional): estado externo do aberto/fechado. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

/** Trigger: se for um elemento, o comportamento é MESCLADO nele (sem wrapper);
 *  senão, vira um botão focável (a11y correta por padrão).
 *  `toggle` cobre o modo CONTROLADO: o Base UI 1.0.0-rc.0 não dispara
 *  onOpenChange no clique do trigger quando `open` é controlado — compomos
 *  o toggle aqui (os caminhos ESC/clique-fora já disparam corretamente). */
function triggerRender(trigger: ReactNode, toggle?: () => void) {
  const extra = toggle ? { onClick: toggle } : null;
  return isValidElement(trigger)
    ? { render: trigger as React.ReactElement<Record<string, unknown>>, ...extra }
    : { children: trigger, ...extra };
}

export type MenuProps = FloatingProps;

export function Menu({ trigger, children, align = 'start', className, open, defaultOpen, onOpenChange }: MenuProps) {
  const controlled = open !== undefined;
  return (
    <BaseMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={(o) => onOpenChange?.(o)}>
      <BaseMenu.Trigger {...triggerRender(trigger, controlled ? () => onOpenChange?.(!open) : undefined)} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner align={align} sideOffset={4} className="vyd-positioner vyd-positioner--dropdown">
          <BaseMenu.Popup className={cx('vyd-menu', className)}>{children}</BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}

export type MenuItemProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon?: IconName; danger?: boolean };
export function MenuItem({ icon, danger, className, children, disabled, onClick, ...rest }: MenuItemProps) {
  return (
    <BaseMenu.Item
      disabled={disabled}
      onClick={onClick as (e: React.MouseEvent) => void}
      className={cx('vyd-menu__item', danger && 'vyd-menu__item--danger', className)}
      render={<button type="button" {...rest} />}
    >
      {icon ? <Icon name={icon} size="sm" /> : null}
      {children}
    </BaseMenu.Item>
  );
}
export function MenuSeparator() {
  return <BaseMenu.Separator className="vyd-menu__sep" />;
}
export function MenuLabel({ children }: { children: ReactNode }) {
  return <div className="vyd-menu__label">{children}</div>;
}

export type PopoverProps = FloatingProps;
export function Popover({ trigger, children, align = 'start', className, open, defaultOpen, onOpenChange }: PopoverProps) {
  const controlled = open !== undefined;
  return (
    <BasePopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={(o) => onOpenChange?.(o)}>
      <BasePopover.Trigger {...triggerRender(trigger, controlled ? () => onOpenChange?.(!open) : undefined)} />
      <BasePopover.Portal>
        <BasePopover.Positioner align={align} sideOffset={4} className="vyd-positioner vyd-positioner--popover">
          <BasePopover.Popup className={cx('vyd-popover', className)}>{children}</BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

/* =====================================================================
   Tooltip (CSS: hover/focus-within, zero-JS) · Toolbar.
   Mantido CSS-first de propósito; ganha o wiring aria-describedby.
   ===================================================================== */

export function Tooltip({ content, children, className }: { content: ReactNode; children: ReactNode; className?: string }) {
  const id = useId();
  return (
    <span className={cx('vyd-tooltip-wrap', className)} aria-describedby={id}>
      {children}
      <span className="vyd-tooltip" role="tooltip" id={id}>
        {content}
      </span>
    </span>
  );
}

export function Toolbar({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('vyd-toolbar', className)} role="toolbar" {...rest}>
      {children}
    </div>
  );
}
export function ToolbarSeparator() {
  return <span className="vyd-toolbar__sep" />;
}
