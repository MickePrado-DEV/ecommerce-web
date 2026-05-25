'use client';

import Link from 'next/link';
import type { CatalogPreview } from '@/shared/lib/catalog/nav';

export function CatalogPreviewPanel({
  preview,
  onNavigate,
}: {
  preview: CatalogPreview | null;
  onNavigate: () => void;
}) {
  if (!preview) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Pasa el cursor sobre una familia
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/90 pb-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/catalog/${preview.familySlug}`}
            onClick={onNavigate}
            className="text-xl font-bold text-white hover:text-purple-300"
          >
            {preview.familyName}
          </Link>
          <Link
            href="/catalog"
            onClick={onNavigate}
            className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            Ver todo
          </Link>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-6">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-3">
          {preview.categories.map((cat) => (
            <div key={cat.id}>
              <Link
                href={`/catalog/${preview.familySlug}/${cat.slug}`}
                onClick={onNavigate}
                className="text-lg font-semibold text-purple-400 hover:text-purple-300"
              >
                {cat.name}
              </Link>
              {cat.subCategories.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {cat.subCategories.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/catalog/${preview.familySlug}/${cat.slug}/${sub.slug}`}
                        onClick={onNavigate}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
