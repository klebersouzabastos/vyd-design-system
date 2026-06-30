import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';
import { CubeMark } from './CubeMark';

/* =====================================================================
   App shell — React mirror of css/shell.css. Requires the app to import
   `@vyd/design-system/theme.css` and `@vyd/design-system/shell.css`.
   ===================================================================== */

/** Root grid. `railCollapsed` toggles the 240→48px left rail. */
export function AppShell({
  railCollapsed = false,
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { railCollapsed?: boolean }) {
  return (
    <div className={cx('vyd-app', railCollapsed && 'vyd-app--rail-collapsed', className)} {...rest}>
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
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      <span className="glyph">{glyph}</span>
      <span className="label">{label}</span>
    </span>
  );
}

/* ---- Left rail ---- */
export function LeftRail({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <aside className={cx('vyd-leftrail', className)} {...rest}>
      {children}
    </aside>
  );
}

export function RailSectionLabel({ children }: { children: ReactNode }) {
  return <div className="vyd-rail-section__label">{children}</div>;
}

export function RailItem({
  current = false,
  dotColor,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { current?: boolean; dotColor?: string }) {
  return (
    <div className="vyd-rail-item" aria-current={current || undefined} {...rest}>
      <span className="dot" style={dotColor ? { background: dotColor } : undefined} />
      <span>{children}</span>
    </div>
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

/* ---- Right panel ---- */
export function RightPanel({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <aside className={cx('vyd-rightpanel', className)} {...rest}>
      {children}
    </aside>
  );
}

export function PanelSectionLabel({ children }: { children: ReactNode }) {
  return <div className="vyd-panel-section__label">{children}</div>;
}

/** Key/value property row (mono value with tabular figures). */
export function Prop({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="vyd-prop">
      <span className="vyd-prop__key">{label}</span>
      <span className="vyd-prop__val">{children}</span>
    </div>
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
