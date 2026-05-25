'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { Menu, X } from 'lucide-react';

export function CatalogDrawer() {
  const [open, setOpen] = useState(false);
  const { data: families } = useQuery({
    queryKey: queryKeys.families,
    queryFn: catalogApi.getFamilies,
    enabled: open,
  });

  return (
    <>
      <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setOpen(true)} aria-label="Menú catálogo">
        <Menu className="h-5 w-5" />
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} aria-label="Cerrar" />
          <aside className="absolute left-0 top-0 h-full w-72 overflow-y-auto border-r border-white/10 bg-zinc-950 p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">Catálogo</span>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-4 text-sm">
              {families?.map((f) => (
                <div key={f.id}>
                  <Link
                    href={`/families/${f.slug}`}
                    className="font-medium text-violet-400 hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    {f.name}
                  </Link>
                  <ul className="mt-1 space-y-1 pl-3 text-zinc-400">
                    {f.categories.map((c) => (
                      <li key={c.id}>
                        <Link href={`/categories/${c.slug}`} onClick={() => setOpen(false)}>
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
