'use client';

import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { FacetGroup } from '@/entities/catalog/lib/catalog-facets';
import type { CatalogFiltersState } from '@/shared/lib/catalog-query-state';

export function FilterAccordion({
  facets,
  filters,
  openFacetKey,
  onOpenFacetKey,
  onToggle,
}: {
  facets: FacetGroup[];
  filters: CatalogFiltersState;
  openFacetKey: string | null;
  onOpenFacetKey: (key: string | null) => void;
  onToggle: (optionId: string, valueId: string, checked: boolean) => void;
}) {
  return (
    <div className="space-y-2">
      {facets.map((facet) => {
        const isOpen = openFacetKey === facet.key;
        return (
          <div key={facet.key} className="rounded-lg border border-gray-800">
            <button
              type="button"
              className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium text-white hover:bg-gray-800/50"
              onClick={() => onOpenFacetKey(isOpen ? null : facet.key)}
              aria-expanded={isOpen}
            >
              {facet.label}
              <ChevronDown
                className={cn('h-4 w-4 text-gray-400 transition', isOpen && 'rotate-180')}
              />
            </button>
            {isOpen && (
              <div className="max-h-56 overflow-y-auto overscroll-contain border-t border-gray-800 px-3 py-2">
                <ul className="space-y-2">
                  {facet.options.map((opt) => {
                    const checked = (filters[facet.key] ?? filters._legacy ?? []).includes(
                      opt.value,
                    );
                    return (
                      <li key={opt.value}>
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300 hover:text-white">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => onToggle(facet.key, opt.value, e.target.checked)}
                            className="rounded border-gray-600"
                          />
                          <span className="flex-1">{opt.label}</span>
                          <span className="text-xs text-gray-500">({opt.count})</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
