'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';
import { Icon, type IconName } from './Icon';

/* =====================================================================
   Dialog / Drawer — <dialog> nativo (foco-trap, ESC e backdrop de graça).
   ===================================================================== */

function useNativeDialog(open: boolean, onClose?: () => void) {
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
   Menu / Popover — flutuante ancorado (fecha por clique-fora e ESC).
   ===================================================================== */

function useAnchoredPopup(align: 'start' | 'end') {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const update = () => {
      const r = triggerRef.current!.getBoundingClientRect();
      setPos({ top: r.bottom + 4, left: align === 'end' ? r.right : r.left });
    };
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !triggerRef.current?.contains(t)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const style: CSSProperties = {
    position: 'fixed',
    top: pos.top,
    left: pos.left,
    transform: align === 'end' ? 'translateX(-100%)' : undefined,
  };
  return { open, setOpen, triggerRef, panelRef, style };
}

export type MenuProps = { trigger: ReactNode; children: ReactNode; align?: 'start' | 'end'; className?: string };

export function Menu({ trigger, children, align = 'start', className }: MenuProps) {
  const { open, setOpen, triggerRef, panelRef, style } = useAnchoredPopup(align);
  return (
    <>
      <span ref={triggerRef} style={{ display: 'inline-flex' }} onClick={() => setOpen((o) => !o)}>
        {trigger}
      </span>
      {open ? (
        <div ref={panelRef} className={cx('vyd-menu', className)} role="menu" style={style} onClick={() => setOpen(false)}>
          {children}
        </div>
      ) : null}
    </>
  );
}

export type MenuItemProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon?: IconName; danger?: boolean };
export function MenuItem({ icon, danger, className, children, ...rest }: MenuItemProps) {
  return (
    <button type="button" role="menuitem" className={cx('vyd-menu__item', danger && 'vyd-menu__item--danger', className)} {...rest}>
      {icon ? <Icon name={icon} size="sm" /> : null}
      {children}
    </button>
  );
}
export function MenuSeparator() {
  return <div className="vyd-menu__sep" role="separator" />;
}
export function MenuLabel({ children }: { children: ReactNode }) {
  return <div className="vyd-menu__label">{children}</div>;
}

export type PopoverProps = { trigger: ReactNode; children: ReactNode; align?: 'start' | 'end'; className?: string };
export function Popover({ trigger, children, align = 'start', className }: PopoverProps) {
  const { open, setOpen, triggerRef, panelRef, style } = useAnchoredPopup(align);
  return (
    <>
      <span ref={triggerRef} style={{ display: 'inline-flex' }} onClick={() => setOpen((o) => !o)}>
        {trigger}
      </span>
      {open ? (
        <div ref={panelRef} className={cx('vyd-popover', className)} style={style}>
          {children}
        </div>
      ) : null}
    </>
  );
}

/* =====================================================================
   Tooltip (CSS: hover/focus-within) · Toolbar.
   ===================================================================== */

export function Tooltip({ content, children, className }: { content: ReactNode; children: ReactNode; className?: string }) {
  return (
    <span className={cx('vyd-tooltip-wrap', className)}>
      {children}
      <span className="vyd-tooltip" role="tooltip">
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
