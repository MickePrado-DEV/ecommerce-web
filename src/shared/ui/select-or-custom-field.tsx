'use client';

import { useEffect, useId, useState } from 'react';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/utils';

const CUSTOM_VALUE = '__custom__';

export function SelectOrCustomField({
  label,
  value,
  options,
  onChange,
  placeholder = 'Selecciona…',
  disabled,
  className,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const id = useId();
  const uniqueOptions = [...new Set(options.filter(Boolean))];
  const inList = value && uniqueOptions.includes(value);
  const [mode, setMode] = useState<'select' | 'custom'>(inList || !value ? 'select' : 'custom');

  useEffect(() => {
    if (value && uniqueOptions.includes(value)) setMode('select');
  }, [value, uniqueOptions]);

  return (
    <div className={cn('space-y-1', className)}>
      <Label htmlFor={id}>{label}</Label>
      {mode === 'select' ? (
        <select
          id={id}
          disabled={disabled}
          className="mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
          value={inList ? value : ''}
          onChange={(e) => {
            const v = e.target.value;
            if (v === CUSTOM_VALUE) {
              setMode('custom');
              onChange('');
              return;
            }
            onChange(v);
          }}
        >
          <option value="">{placeholder}</option>
          {uniqueOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          <option value={CUSTOM_VALUE}>Otro (escribir manualmente)</option>
        </select>
      ) : (
        <div className="flex gap-2">
          <Input
            id={id}
            disabled={disabled}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Escribe…"
            className="h-10 border-slate-700 bg-slate-900"
          />
          {uniqueOptions.length > 0 && (
            <button
              type="button"
              disabled={disabled}
              className="shrink-0 text-xs text-violet-400 hover:text-violet-300"
              onClick={() => {
                setMode('select');
                onChange(uniqueOptions[0] ?? '');
              }}
            >
              Lista
            </button>
          )}
        </div>
      )}
    </div>
  );
}
