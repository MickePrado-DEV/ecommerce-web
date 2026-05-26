'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { ColumnFilterConfig, FilterOption } from '@/shared/types/admin-table-config';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/utils';

function resolveFilterUi(filter?: ColumnFilterConfig): 'input' | 'multi-select' {
  if (filter?.ui === 'multi-select') return 'multi-select';
  return 'input';
}

export function columnHasFilter(filter?: ColumnFilterConfig, searchable?: boolean): boolean {
  return Boolean(filter) || Boolean(searchable);
}

export function getColumnFilterUi(filter?: ColumnFilterConfig): 'input' | 'multi-select' {
  return resolveFilterUi(filter);
}

export function AdminTableColumnFilter({
  filter,
  searchable,
  textValue = '',
  selected = [],
  options = [],
  onTextChange,
  onMultiChange,
}: {
  filter?: ColumnFilterConfig;
  searchable?: boolean;
  textValue?: string;
  selected?: string[];
  options?: FilterOption[];
  onTextChange?: (value: string) => void;
  onMultiChange?: (values: string[]) => void;
}) {
  const ui = getColumnFilterUi(filter);

  if (ui === 'input') {
    if (!columnHasFilter(filter, searchable)) return null;
    return (
      <Input
        placeholder={filter?.placeholder ?? 'Buscar…'}
        value={textValue}
        onChange={(e) => onTextChange?.(e.target.value)}
        className="h-8 text-xs"
      />
    );
  }

  if (!filter?.field || !filter.optionsSource) return null;

  return (
    <ColumnMultiSelectFilter
      placeholder={filter.placeholder}
      selected={selected}
      options={options}
      searchableInOptions={filter.searchableInOptions}
      onChange={onMultiChange ?? (() => {})}
    />
  );
}

function ColumnMultiSelectFilter({
  placeholder = 'Seleccionar…',
  selected,
  options,
  searchableInOptions,
  onChange,
}: {
  placeholder?: string;
  selected: string[];
  options: FilterOption[];
  searchableInOptions?: boolean;
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!searchableInOptions || !term) return options;
    return options.filter((o) => o.label.toLowerCase().includes(term));
  }, [options, q, searchableInOptions]);

  const label =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? (options.find((o) => o.value === selected[0])?.label ?? '1 seleccionado')
        : `${selected.length} seleccionados`;

  const toggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(next);
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-8 w-full min-w-[8rem] items-center justify-between gap-1 rounded-md border border-white/10 bg-zinc-900 px-2 text-left text-xs text-zinc-200',
          selected.length > 0 && 'border-violet-500/40 text-violet-100',
        )}
      >
        <span className="truncate">{label}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 opacity-60', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-white/10 bg-zinc-950 p-2 shadow-xl">
          {searchableInOptions && (
            <Input
              placeholder="Buscar opción…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="mb-2 h-7 text-xs"
            />
          )}
          <div className="max-h-48 space-y-0.5 overflow-y-auto">
            {filtered.map((opt) => {
              const checked = selected.includes(opt.value);
              return (
                <label
                  key={opt.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-white/5',
                    checked && 'bg-white/5',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    className="rounded border-white/20 bg-zinc-800 text-violet-600"
                    onChange={() => toggle(opt.value)}
                  />
                  <span className="truncate text-zinc-200">{opt.label}</span>
                </label>
              );
            })}
            {!filtered.length && <p className="px-2 py-1 text-xs text-zinc-500">Sin opciones</p>}
          </div>
          {selected.length > 0 && (
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-center gap-1 rounded py-1 text-xs text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
              onClick={() => onChange([])}
            >
              <X className="h-3 w-3" />
              Limpiar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
