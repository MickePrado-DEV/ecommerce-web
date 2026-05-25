import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

/** Card oscura alineada al UI de tienda (capturas). */
export function StoreCard({
  children,
  className,
  padding = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padding?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-700/50 bg-slate-900/60 shadow-lg shadow-black/20',
        padding && 'p-6',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
