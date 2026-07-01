import type {
  HTMLAttributes,
  ReactNode,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import { cx } from './cx';
import { Icon, type IconName } from './Icon';

/* =====================================================================
   Table / data-grid — wrappers estilizados. O estado (dados, ordenação,
   seleção) é do app; os componentes renderizam os estados visuais.
   ===================================================================== */

/** Contêiner com scroll + header sticky (`.vyd-table-wrap`). */
export function TableWrap({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('vyd-table-wrap', className)} {...rest} />;
}

export function Table({
  zebra,
  compact,
  className,
  ...rest
}: TableHTMLAttributes<HTMLTableElement> & { zebra?: boolean; compact?: boolean }) {
  return <table className={cx('vyd-table', zebra && 'vyd-table--zebra', compact && 'vyd-table--compact', className)} {...rest} />;
}

export function Thead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}
export function Tbody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

/** Linha; `selected` aplica o realce de seleção. */
export function Tr({ selected, ...rest }: HTMLAttributes<HTMLTableRowElement> & { selected?: boolean }) {
  return <tr aria-selected={selected || undefined} {...rest} />;
}

export type SortDir = 'asc' | 'desc' | null;
export type ThProps = ThHTMLAttributes<HTMLTableCellElement> & {
  numeric?: boolean;
  sortable?: boolean;
  sortDir?: SortDir;
  onSort?: () => void;
};

export function Th({ numeric, sortable, sortDir = null, onSort, className, children, ...rest }: ThProps) {
  const ariaSort = sortDir === 'asc' ? 'ascending' : sortDir === 'desc' ? 'descending' : 'none';
  if (sortable) {
    return (
      <th className={cx(numeric && 'vyd-num', className)} aria-sort={ariaSort} {...rest}>
        <button type="button" className="vyd-table__sort" aria-sort={ariaSort} onClick={onSort}>
          {children}
          <Icon name="chevron-up" size="sm" />
        </button>
      </th>
    );
  }
  return (
    <th className={cx(numeric && 'vyd-num', className)} {...rest}>
      {children}
    </th>
  );
}

export function Td({ numeric, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return <td className={cx(numeric && 'vyd-num', className)} {...rest} />;
}

/* =====================================================================
   List
   ===================================================================== */

export function List({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('vyd-list', className)} {...rest} />;
}

export type ListItemProps = HTMLAttributes<HTMLDivElement> & {
  icon?: IconName;
  title?: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  selected?: boolean;
};
export function ListItem({ icon, title, subtitle, trailing, selected, className, children, ...rest }: ListItemProps) {
  return (
    <div className={cx('vyd-list__item', className)} aria-selected={selected || undefined} {...rest}>
      {icon ? <Icon name={icon} className="vyd-list__icon" /> : null}
      <div className="vyd-list__body">
        {title != null ? <span className="vyd-list__title">{title}</span> : null}
        {subtitle != null ? <span className="vyd-list__sub">{subtitle}</span> : null}
        {children}
      </div>
      {trailing != null ? <span className="vyd-list__trailing">{trailing}</span> : null}
    </div>
  );
}

/* =====================================================================
   Tree — indentação por `level`; expand/collapse controlado pelo app.
   ===================================================================== */

export function Tree({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('vyd-tree', className)} role="tree" {...rest} />;
}

export type TreeItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'onToggle'> & {
  label: ReactNode;
  icon?: IconName;
  level?: number;
  leaf?: boolean;
  expanded?: boolean;
  selected?: boolean;
  onToggle?: () => void;
};
export function TreeItem({ label, icon, level = 0, leaf, expanded, selected, onToggle, className, style, ...rest }: TreeItemProps) {
  return (
    <div
      className={cx('vyd-tree__item', className)}
      role="treeitem"
      aria-selected={selected || undefined}
      aria-expanded={leaf ? undefined : !!expanded}
      style={{ paddingLeft: `calc(${level} * var(--vyd-space-5) + var(--vyd-space-2))`, ...style }}
      {...rest}
    >
      <button
        type="button"
        className={cx('vyd-tree__toggle', leaf && 'vyd-tree__toggle--leaf')}
        aria-hidden={leaf || undefined}
        tabIndex={leaf ? -1 : 0}
        onClick={(e) => {
          e.stopPropagation();
          onToggle?.();
        }}
      >
        <Icon name="chevron-right" size="sm" />
      </button>
      {icon ? <Icon name={icon} size="sm" className="vyd-tree__icon" /> : null}
      {label}
    </div>
  );
}

/* =====================================================================
   Stat / KPI · Key-value
   ===================================================================== */

export type StatProps = {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  trend?: 'up' | 'down';
  className?: string;
};
export function Stat({ label, value, delta, trend, className }: StatProps) {
  return (
    <div className={cx('vyd-stat', className)}>
      <span className="vyd-stat__label">{label}</span>
      <span className="vyd-stat__value">{value}</span>
      {delta != null ? (
        <span className={cx('vyd-stat__delta', trend === 'up' && 'vyd-stat__delta--up', trend === 'down' && 'vyd-stat__delta--down')}>
          {trend ? <Icon name="chevron-up" size="sm" style={trend === 'down' ? { transform: 'rotate(180deg)' } : undefined} /> : null}
          {delta}
        </span>
      ) : null}
    </div>
  );
}

/** Painel de propriedades chave/valor (`.vyd-kv`). Use <KV> para cada par. */
export function KeyValue({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cx('vyd-kv', className)} {...rest} />;
}
export function KV({ k, valueClassName, children }: { k: ReactNode; valueClassName?: string; children: ReactNode }) {
  return (
    <>
      <span className="vyd-kv__key">{k}</span>
      <span className={cx('vyd-kv__val', valueClassName)}>{children}</span>
    </>
  );
}
