'use client';

import { Fragment, createContext, useContext, useId } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cx } from './cx';
import { Icon, type IconName } from './Icon';

/* ---- Tabs (standalone) — padrão WAI-ARIA Tabs ----
   Modo simples (compat): <Tab selected onClick> soltos dentro de <Tabs>.
   Modo controlado: <Tabs value onChange> + <Tab value> + <TabPanel value> —
   ganha setas ←/→ Home/End (roving tabindex) e aria-controls/labelledby. */

type TabsCtx = { value?: string; onChange?: (v: string) => void; baseId: string } | null;
const TabsContext = createContext<TabsCtx>(null);

/** Raiz do modo controlado — envolve <Tabs> (tablist) E os <TabPanel>. */
export function TabsRoot({ value, onChange, children }: { value: string; onChange?: (v: string) => void; children: ReactNode }) {
  const baseId = useId();
  return <TabsContext.Provider value={{ value, onChange, baseId }}>{children}</TabsContext.Provider>;
}

/** Navegação por setas dentro do tablist (roving focus). */
function onTablistKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (!keys.includes(e.key)) return;
  const tabs = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'));
  if (!tabs.length) return;
  const i = tabs.indexOf(document.activeElement as HTMLElement);
  let next = i;
  if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
  else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length;
  else if (e.key === 'Home') next = 0;
  else next = tabs.length - 1;
  tabs[next]?.focus();
  tabs[next]?.click();
  e.preventDefault();
}

export type TabsProps = HTMLAttributes<HTMLDivElement>;
export function Tabs({ className, onKeyDown, ...rest }: TabsProps) {
  return (
    <div
      className={cx('vyd-tabs', className)}
      role="tablist"
      onKeyDown={(e) => {
        onTablistKeyDown(e);
        onKeyDown?.(e);
      }}
      {...rest}
    />
  );
}

export type TabProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  icon?: IconName;
  /** Modo controlado: identidade da aba (casa com <TabPanel value>). */
  value?: string;
};
export function Tab({ selected, icon, value, className, children, onClick, ...rest }: TabProps) {
  const ctx = useContext(TabsContext);
  const controlled = ctx?.value !== undefined && value !== undefined;
  const isSelected = controlled ? ctx!.value === value : !!selected;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isSelected}
      tabIndex={isSelected ? 0 : -1}
      id={controlled ? `${ctx!.baseId}-tab-${value}` : undefined}
      aria-controls={controlled ? `${ctx!.baseId}-panel-${value}` : undefined}
      className={cx('vyd-tab', className)}
      onClick={(e) => {
        if (controlled) ctx!.onChange?.(value!);
        onClick?.(e);
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size="sm" /> : null}
      {children}
    </button>
  );
}

/** Painel do modo controlado — renderiza só quando a aba ativa casa com `value`. */
export function TabPanel({ value, className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const ctx = useContext(TabsContext);
  const active = ctx?.value === value;
  if (!active) return null;
  return (
    <div
      role="tabpanel"
      id={`${ctx!.baseId}-panel-${value}`}
      aria-labelledby={`${ctx!.baseId}-tab-${value}`}
      tabIndex={0}
      className={className}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ---- Breadcrumbs ---- */
export type Crumb = { label: ReactNode; href?: string; icon?: IconName; onClick?: () => void };
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav className={cx('vyd-breadcrumbs', className)} aria-label="breadcrumb">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        const content = (
          <>
            {it.icon ? <Icon name={it.icon} size="sm" /> : null}
            {it.label}
          </>
        );
        return (
          <Fragment key={i}>
            {last ? (
              <span className="vyd-breadcrumb" aria-current="page">{content}</span>
            ) : it.href ? (
              <a className="vyd-breadcrumb" href={it.href} onClick={it.onClick}>{content}</a>
            ) : (
              <button type="button" className="vyd-breadcrumb" onClick={it.onClick}>{content}</button>
            )}
            {last ? null : (
              <span className="vyd-breadcrumbs__sep" aria-hidden="true">
                <Icon name="chevron-right" size="sm" />
              </span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

/* ---- Pagination ---- */
function pageRange(page: number, total: number, sibs = 1): (number | '…')[] {
  const out: (number | '…')[] = [];
  const start = Math.max(1, page - sibs);
  const end = Math.min(total, page + sibs);
  out.push(1);
  if (start > 2) out.push('…');
  for (let p = Math.max(2, start); p <= Math.min(total - 1, end); p++) out.push(p);
  if (end < total - 1) out.push('…');
  if (total > 1) out.push(total);
  return out;
}
export function Pagination({ page, total, onChange, className }: { page: number; total: number; onChange?: (p: number) => void; className?: string }) {
  return (
    <nav className={cx('vyd-pagination', className)} aria-label="paginação">
      <button type="button" className="vyd-page" aria-label="Anterior" disabled={page <= 1} onClick={() => onChange?.(page - 1)}>
        <Icon name="chevron-left" size="sm" />
      </button>
      {pageRange(page, total).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="vyd-pagination__ellipsis">…</span>
        ) : (
          <button key={p} type="button" className="vyd-page" aria-current={p === page ? 'page' : undefined} onClick={() => onChange?.(p)}>
            {p}
          </button>
        ),
      )}
      <button type="button" className="vyd-page" aria-label="Próxima" disabled={page >= total} onClick={() => onChange?.(page + 1)}>
        <Icon name="chevron-right" size="sm" />
      </button>
    </nav>
  );
}

/* ---- Steps / wizard ---- */
export function Steps({ items, current, className }: { items: ReactNode[]; current: number; className?: string }) {
  return (
    <div className={cx('vyd-steps', className)}>
      {items.map((label, i) => {
        const done = i < current;
        const state = done ? 'vyd-step--done' : i === current ? 'vyd-step--current' : '';
        return (
          <Fragment key={i}>
            {i > 0 ? <div className={cx('vyd-steps__line', i <= current && 'vyd-steps__line--done')} /> : null}
            <div className={cx('vyd-step', state)}>
              <span className="vyd-step__marker">{done ? <Icon name="check" size="sm" /> : i + 1}</span>
              <span className="vyd-step__label">{label}</span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}

/* ---- Kbd ---- */
export function Kbd({ className, children }: { className?: string; children: ReactNode }) {
  return <kbd className={cx('vyd-kbd', className)}>{children}</kbd>;
}
