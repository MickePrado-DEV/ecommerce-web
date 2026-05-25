import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';

const variants = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  info: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  neutral: 'border-slate-600/50 bg-slate-800/80 text-slate-300',
  danger: 'border-red-500/30 bg-red-500/10 text-red-300',
};

export function PillBadge({
  children,
  variant = 'neutral',
  className,
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
