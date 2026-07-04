import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cx } from './cx';
import { CubeMark } from './CubeMark';

/* =====================================================================
   App shell — React mirror of css/shell.css. Requires the app to import
   `vyd-design-system/theme.css` and `vyd-design-system/shell.css`.

   REGRA DURA (ver AGENTS.md): navegação é SEMPRE a ribbon no topo. NÃO
   existe menu lateral esquerdo nem painéis laterais. O shell é coluna
   única: TopBar · RibbonTabs (opcional) · Ribbon · Canvas (cheio) ·
   StatusBar. Qualquer lista/inspetor do app vai DENTRO do Canvas.
   ===================================================================== */

/** Root grid (coluna única, canvas em largura cheia). */
export function AppShell({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cx('vyd-app', className)} {...rest}>
      {children}
    </div>
  );
}

/* ---- Top bar ---- */
export function TopBar({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <header className={cx('vyd-topbar', className)} {...rest}>
      {children}
    </header>
  );
}

/** Brand lockup in the top bar: official cube + "VYD". */
export function TopBarBrand({ label = 'VYD' }: { label?: string }) {
  return (
    <div className="vyd-topbar__brand">
      <CubeMark size={22} variant="positive" />
      <span>{label}</span>
    </div>
  );
}

export function TopBarSpacer() {
  return <span className="vyd-topbar__spacer" />;
}

/** Which VYD tool is open. */
export function ToolSwitcher({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className={cx('vyd-tool-switcher', className)} {...rest}>
      <span className="vyd-tool-switcher__dot" />
      <span>{children}</span>
      <span aria-hidden="true">▾</span>
    </button>
  );
}

/** Account avatar (initials). */
export function Avatar({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <span className="vyd-avatar" title={title}>
      {children}
    </span>
  );
}

/* ---- Ribbon tabs (optional strip above the command groups) ---- */
function onRibbonTablistKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'));
  if (!tabs.length) return;
  const i = tabs.indexOf(document.activeElement as HTMLElement);
  let n = i;
  if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
  else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
  else if (e.key === 'Home') n = 0;
  else n = tabs.length - 1;
  tabs[n]?.focus();
  tabs[n]?.click();
  e.preventDefault();
}

export function RibbonTabs({ className, children, onKeyDown, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cx('vyd-ribbon-tabs', className)}
      role="tablist"
      onKeyDown={(e) => { onRibbonTablistKeyDown(e); onKeyDown?.(e); }}
      {...rest}
    >
      {children}
    </div>
  );
}

/** A ribbon tab. Active state = accent underline via aria-selected. */
export function RibbonTab({
  selected = false,
  children,
  onClick,
  onKeyDown,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { selected?: boolean }) {
  return (
    <span
      className="vyd-ribbon-tab"
      role="tab"
      tabIndex={selected ? 0 : -1}
      aria-selected={selected}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).click();
        }
        onKeyDown?.(e);
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

/* ---- Ribbon ---- */
export function Ribbon({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cx('vyd-ribbon', className)} aria-label="Comandos" {...rest}>
      {children}
    </nav>
  );
}

export function RibbonGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="vyd-ribbon-group">
      <div className="vyd-ribbon-group__items">{children}</div>
      <span className="vyd-ribbon-group__label">{label}</span>
    </div>
  );
}

/**
 * Ribbon command. Active state = accent bar (Autodesk pattern) via aria-selected.
 * Rendered as a span to match css/shell.css (the demo uses spans); role/tabIndex
 * keep it keyboard-focusable.
 */
export function RibbonItem({
  label,
  glyph,
  selected = false,
  disabled = false,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & {
  label: ReactNode;
  glyph: ReactNode;
  selected?: boolean;
  disabled?: boolean;
}) {
  return (
    <span
      className="vyd-ribbon-item"
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClickCapture={(e) => { if (disabled) { e.preventDefault(); e.stopPropagation(); } }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).click();
        }
      }}
      {...rest}
    >
      <span className="glyph">{glyph}</span>
      <span className="label">{label}</span>
    </span>
  );
}

/* ---- Canvas ---- */
export function Canvas({
  grid = false,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & { grid?: boolean }) {
  return (
    <main className={cx('vyd-canvas', grid && 'vyd-canvas--grid', className)} {...rest}>
      {children}
    </main>
  );
}

/* ---- Status bar ---- */
export function StatusBar({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cx('vyd-statusbar', className)} {...rest}>
      {children}
    </footer>
  );
}

export function StatusBarSpacer() {
  return <span className="vyd-statusbar__spacer" />;
}
