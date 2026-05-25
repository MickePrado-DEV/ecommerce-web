'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';

export function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div
      className={cn(
        'sticky bottom-0 z-10 flex items-center justify-center gap-1 border-t border-gray-800 bg-gray-950/95 py-3 backdrop-blur',
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          type="button"
          variant={p === page ? 'default' : 'ghost'}
          size="sm"
          className={p === page ? 'bg-purple-600 hover:bg-purple-700' : ''}
          onClick={() => onPageChange(p)}
        >
          {p}
        </Button>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Página siguiente"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
