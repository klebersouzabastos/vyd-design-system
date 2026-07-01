'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

export type Command = {
  id: string;
  label: string;
  icon?: IconName;
  hint?: ReactNode;
  keywords?: string;
  onSelect?: () => void;
};

export type CommandPaletteProps = {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  placeholder?: string;
};

/**
 * Command palette (⌘K) — busca + navegação por teclado (↑/↓/Enter/Esc),
 * clique-fora fecha. Controlado por `open`/`onClose`.
 */
export function CommandPalette({ open, onClose, commands, placeholder = 'Buscar comando…' }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.keywords ?? ''}`.toLowerCase().includes(q));
  }, [query, commands]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      const t = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(t);
    }
  }, [open]);
  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const choose = (c?: Command) => {
    if (!c) return;
    c.onSelect?.();
    onClose();
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(filtered[active]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div className="vyd-cmdk-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="vyd-cmdk" role="dialog" aria-modal="true" aria-label="Paleta de comandos" onKeyDown={onKey}>
        <div className="vyd-cmdk__search">
          <Icon name="search" />
          <input
            ref={inputRef}
            className="vyd-cmdk__input"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={placeholder}
          />
          <kbd className="vyd-kbd">ESC</kbd>
        </div>
        <div className="vyd-cmdk__list" role="listbox">
          {filtered.length === 0 ? (
            <div className="vyd-cmdk__empty">Nada encontrado.</div>
          ) : (
            filtered.map((c, i) => (
              <div
                key={c.id}
                role="option"
                aria-selected={i === active}
                className="vyd-cmdk__item"
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(c)}
              >
                {c.icon ? <Icon name={c.icon} size="sm" /> : null}
                {c.label}
                {c.hint != null ? <span className="vyd-cmdk__item-trailing">{c.hint}</span> : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
