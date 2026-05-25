'use client';

import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { useLockBodyScroll } from '@/shared/hooks/use-lock-body-scroll';
import { getCatalogByFamily, getDefaultFamilyId } from '@/shared/lib/catalog/nav';
import { SidebarNav } from '@/widgets/store-drawer/ui/sidebar-nav';
import { CatalogPreviewPanel } from '@/widgets/store-drawer/ui/catalog-preview-panel';
import { Button } from '@/shared/ui/button';
import { X } from 'lucide-react';

export function StoreDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [activeFamilyId, setActiveFamilyId] = useState<string | null>(null);

  const { data: families } = useQuery({
    queryKey: queryKeys.families,
    queryFn: catalogApi.getFamilies,
    enabled: open,
  });

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) {
      setActiveFamilyId(null);
      return;
    }
    if (families?.length && activeFamilyId === null) {
      setActiveFamilyId(getDefaultFamilyId(families));
    }
  }, [open, families, activeFamilyId]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleFamilyHover = useCallback((id: string) => {
    setActiveFamilyId(id);
  }, []);

  if (!open) return null;

  const preview = families ? getCatalogByFamily(families, activeFamilyId) : null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Cerrar menú"
      />
      <div
        className="relative z-10 flex h-full"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        <aside className="flex h-full w-72 max-w-[85vw] shrink-0 flex-col border-r border-gray-800 bg-gray-900 shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-800 p-4">
            <span className="font-semibold text-white">Menú</span>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-300 hover:bg-gray-800 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
          {families ? (
            <SidebarNav
              families={families}
              activeFamilyId={activeFamilyId}
              onFamilyHover={handleFamilyHover}
              onNavigate={onClose}
            />
          ) : (
            <p className="p-4 text-sm text-gray-500">Cargando catálogo…</p>
          )}
        </aside>

        <div className="hidden h-full min-h-0 w-[min(100vw-18rem,42rem)] flex-col border-r border-gray-800 bg-gray-950 p-6 md:flex lg:w-[36rem] xl:w-[42rem]">
          <CatalogPreviewPanel preview={preview} onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
