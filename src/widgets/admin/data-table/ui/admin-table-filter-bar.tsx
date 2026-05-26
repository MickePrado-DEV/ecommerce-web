'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import type {
  AdminTableFilterGroupDef,
  FilterOption,
  GroupFiltersState,
} from '@/shared/types/admin-table-config';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

export function AdminTableFilterBar({
  groups,
  value,
  optionsByLoader,
  quickSearch,
  quickSearchValue,
  onQuickSearchChange,
  onChange,
}: {
  groups: AdminTableFilterGroupDef[];
  value: GroupFiltersState;
  optionsByLoader: Record<string, FilterOption[]>;
  quickSearch?: { placeholder?: string };
  quickSearchValue?: string;
  onQuickSearchChange?: (v: string) => void;
  onChange: (next: GroupFiltersState) => void;
}) {
  const [open, setOpen] = useState(true);
  const [optionSearch, setOptionSearch] = useState<Record<string, string>>({});

  const activeChips = useMemo(() => {
    const chips: { groupId: string; label: string; field: string; val: string }[] = [];
    for (const g of groups) {
      const selected = value[g.field] ?? [];
      const opts =
        g.optionsSource.kind === 'static'
          ? g.optionsSource.options
          : optionsByLoader[g.optionsSource.loaderKey] ?? [];
      for (const val of selected) {
        const opt = opts.find((o) => o.value === val);
        chips.push({
          groupId: g.id,
          label: opt?.label ?? val,
          field: g.field,
          val,
        });
      }
    }
    return chips;
  }, [groups, value, optionsByLoader]);

  const toggle = (field: string, optValue: string, multi: boolean) => {
    const current = value[field] ?? [];
    const next = multi
      ? current.includes(optValue)
        ? current.filter((v) => v !== optValue)
        : [...current, optValue]
      : current[0] === optValue
        ? []
        : [optValue];
    onChange({ ...value, [field]: next });
  };

  const clearAll = () => {
    const cleared: GroupFiltersState = {};
    for (const g of groups) cleared[g.field] = [];
    onChange(cleared);
    onQuickSearchChange?.('');
  };

  if (!groups.length && !quickSearch) return null;

  return (
    <div className="mb-4 rounded-xl border border-white/10 bg-zinc-900/60">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
        <button
          type="button"
          className="flex items-center gap-2 text-sm font-medium text-zinc-200"
          onClick={() => setOpen((o) => !o)}
        >
          Filtros
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <div className="flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <span
              key={`${chip.field}-${chip.val}`}
              className="inline-flex items-center gap-1 rounded-full bg-violet-600/20 px-2.5 py-0.5 text-xs text-violet-200"
            >
              {chip.label}
              <button
                type="button"
                aria-label={`Quitar ${chip.label}`}
                onClick={() =>
                  onChange({
                    ...value,
                    [chip.field]: (value[chip.field] ?? []).filter((v) => v !== chip.val),
                  })
                }
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {(activeChips.length > 0 || quickSearchValue) && (
            <Button type="button" size="sm" variant="ghost" className="h-7 text-xs" onClick={clearAll}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </div>

      {open && (
        <div className="space-y-4 p-4">
          {quickSearch && onQuickSearchChange && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                Búsqueda rápida
              </p>
              <Input
                placeholder={quickSearch.placeholder ?? 'Buscar…'}
                value={quickSearchValue ?? ''}
                onChange={(e) => onQuickSearchChange(e.target.value)}
                className="max-w-md h-9 text-sm"
              />
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => {
              const multi = (group.mode ?? 'multi') === 'multi';
              const opts =
                group.optionsSource.kind === 'static'
                  ? group.optionsSource.options
                  : optionsByLoader[group.optionsSource.loaderKey] ?? [];
              const q = (optionSearch[group.id] ?? '').toLowerCase();
              const filtered = group.searchableInOptions
                ? opts.filter((o) => o.label.toLowerCase().includes(q))
                : opts;

              return (
                <div
                  key={group.id}
                  className="rounded-lg border border-white/10 bg-zinc-950/50 p-3"
                >
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
                    {group.label}
                  </p>
                  {group.searchableInOptions && (
                    <Input
                      placeholder="Buscar opción…"
                      className="mb-2 h-8 text-xs"
                      value={optionSearch[group.id] ?? ''}
                      onChange={(e) =>
                        setOptionSearch((s) => ({ ...s, [group.id]: e.target.value }))
                      }
                    />
                  )}
                  <div className="max-h-40 space-y-1 overflow-y-auto pr-1">
                    {filtered.map((opt) => {
                      const checked = (value[group.field] ?? []).includes(opt.value);
                      return (
                        <label
                          key={opt.value}
                          className={cn(
                            'flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-white/5',
                            checked && 'bg-white/5',
                          )}
                        >
                          <input
                            type={multi ? 'checkbox' : 'radio'}
                            name={multi ? undefined : group.id}
                            checked={checked}
                            className="rounded border-white/20 bg-zinc-800 text-violet-600"
                            onChange={() => toggle(group.field, opt.value, multi)}
                          />
                          <span className="truncate text-zinc-200">{opt.label}</span>
                        </label>
                      );
                    })}
                    {!filtered.length && (
                      <p className="text-xs text-zinc-500">Sin opciones</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
