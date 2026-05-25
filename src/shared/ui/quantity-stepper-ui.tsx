'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

/** Stepper controlado para detalle de producto u otros flujos. */
export function QuantityStepperUI({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex items-center rounded-xl border border-slate-700/50 bg-slate-900/80', className)}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-l-xl text-slate-300 hover:bg-slate-800"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Disminuir cantidad"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="min-w-[2.5rem] text-center text-sm font-semibold text-white">{value}</span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-10 w-10 rounded-r-xl text-slate-300 hover:bg-slate-800"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Aumentar cantidad"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
