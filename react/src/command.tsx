'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { Icon, type IconName } from './Icon';
import { useNativeDialog } from './overlays';

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
 * Command palette (⌘K) — agora sobre <dialog> nativo: focus-trap real, ESC e
 * fundo inert de graça. Padrão combobox WAI-ARIA: o input mantém o foco e
 * anuncia o item ativo via aria-activedescendant; itens são role="option"
 * com ids estáveis. ↑/↓/Enter navegam; clique seleciona.
 */
export function CommandPalette({ open, onClose, commands, placeholder = 'Buscar comando…' }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useNativeDialog(open, onClose);
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (i: number) => `${baseId}-opt-${i}`;

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

  // item ativo sempre visível na lista
  useEffect(() => {
    listRef.current
      ?.querySelector(`[id="${optionId(active)}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  });

  const choose = (c?: Command) => {
    if (!c) return;
    c.onSelect?.();
    onClose();
  };

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(filtered[active]);
    }
    // ESC: o <dialog> nativo cuida (evento cancel -> onClose)
  };

  return (
    <dialog
      ref={dialogRef}
      className="vyd-cmdk vyd-cmdk--dialog"
      aria-label="Paleta de comandos"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose(); // clique no backdrop
      }}
      onKeyDown={onKey}
    >
      <div className="vyd-cmdk__search">
        <Icon name="search" />
        <input
          ref={inputRef}
          className="vyd-cmdk__input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          role="combobox"
          aria-expanded="true"
          aria-controls={listboxId}
          aria-activedescendant={filtered.length ? optionId(active) : undefined}
          aria-label={placeholder}
          autoComplete="off"
        />
        <kbd className="vyd-kbd">ESC</kbd>
      </div>
      <div className="vyd-cmdk__list" role="listbox" id={listboxId} ref={listRef}>
        {filtered.length === 0 ? (
          <div className="vyd-cmdk__empty">Nada encontrado.</div>
        ) : (
          filtered.map((c, i) => (
            <div
              key={c.id}
              id={optionId(i)}
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
    </dialog>
  );
}
