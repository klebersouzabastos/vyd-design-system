import { Fragment } from 'react';
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cx } from './cx';
import { Icon, type IconName } from './Icon';

/* ---- Tabs (standalone) ---- */
export function Tabs({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('vyd-tabs', className)} role="tablist" {...rest} />;
}
export type TabProps = ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean; icon?: IconName };
export function Tab({ selected, icon, className, children, ...rest }: TabProps) {
  return (
    <button type="button" role="tab" aria-selected={!!selected} className={cx('vyd-tab', className)} {...rest}>
      {icon ? <Icon name={icon} size="sm" /> : null}
      {children}
    </button>
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
