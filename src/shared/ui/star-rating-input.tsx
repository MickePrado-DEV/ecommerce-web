'use client';

import { Star } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function StarRatingInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Valoración">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          className={cn(
            'rounded p-0.5 transition disabled:opacity-40',
            n <= value ? 'text-amber-400' : 'text-slate-600 hover:text-amber-300',
          )}
          aria-label={`${n} estrellas`}
        >
          <Star className={cn('h-6 w-6', n <= value && 'fill-current')} />
        </button>
      ))}
    </div>
  );
}
