'use client';

import type { CoverDto } from '@/entities/catalog/model/types';
import Link from 'next/link';

export function CoverCarousel({ covers }: { covers: CoverDto[] }) {
  if (!covers.length) return null;

  return (
    <section className="space-y-4">
      {covers.map((cover) => (
        <div key={cover.id} className="overflow-hidden rounded-xl border border-white/10">
          <div className="relative aspect-[3/1] bg-zinc-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover.imageUrl} alt={cover.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 to-transparent p-8">
              {cover.linkUrl ? (
                <Link href={cover.linkUrl} className="text-3xl font-bold hover:text-violet-300">
                  {cover.title}
                </Link>
              ) : (
                <h2 className="text-3xl font-bold">{cover.title}</h2>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
