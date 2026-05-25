import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';

export type BreadcrumbSegment = {
  label: string;
  href?: string;
};

export function CatalogBreadcrumb({ segments }: { segments: BreadcrumbSegment[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-2 rounded-full border border-gray-800 bg-gray-900/90 px-4 py-2.5 text-sm"
    >
      <Link href="/" className="flex items-center text-gray-400 hover:text-white">
        <Home className="h-4 w-4" />
        <span className="sr-only">Home</span>
      </Link>
      {segments.map((seg, i) => (
        <span key={`${seg.label}-${i}`} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-600" />
          {seg.href ? (
            <Link href={seg.href} className="text-gray-300 hover:text-white">
              {seg.label}
            </Link>
          ) : (
            <span className="font-medium text-white">{seg.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
