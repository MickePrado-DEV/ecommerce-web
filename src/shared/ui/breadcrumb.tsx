import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-2xl border border-slate-700/50 bg-slate-900/60 px-4 py-2.5 text-sm shadow-sm',
        className,
      )}
    >
      <Link href="/" className="text-slate-400 transition hover:text-white">
        <Home className="h-4 w-4" />
        <span className="sr-only">Inicio</span>
      </Link>
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />
          {item.href ? (
            <Link href={item.href} className="text-slate-300 hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-white">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
