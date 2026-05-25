import { Star } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function StarRating({
  value,
  count,
  size = 'md',
  className,
}: {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const stars = 5;
  const icon = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="flex items-center gap-0.5" aria-label={`${value.toFixed(1)} de 5 estrellas`}>
        {Array.from({ length: stars }).map((_, i) => {
          const filled = value >= i + 1;
          const half = !filled && value > i && value < i + 1;
          return (
            <Star
              key={i}
              className={cn(
                icon,
                filled || half ? 'fill-amber-400 text-amber-400' : 'text-slate-600',
                half && 'opacity-60',
              )}
            />
          );
        })}
      </div>
      <span className="text-sm text-slate-400">
        ({value.toFixed(1)}
        {count !== undefined ? ` · ${count} reseñas` : ''})
      </span>
    </div>
  );
}
