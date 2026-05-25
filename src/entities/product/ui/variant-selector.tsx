'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import type { ProductDetailDto } from '../model/types';
import { Button } from '@/shared/ui/button';
import { StockBadge } from './stock-badge';
import { cn } from '@/shared/lib/utils';

type Props = {
  product: ProductDetailDto;
  slug: string;
  onResolved?: (variantId: string | undefined) => void;
};

export function VariantSelector({ product, slug, onResolved }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const optionValueIds = Object.values(selected);

  const { data: resolved } = useQuery({
    queryKey: ['resolve', slug, optionValueIds.join(',')],
    queryFn: () => catalogApi.resolveVariant(slug, optionValueIds),
    enabled: product.options.length > 0 && optionValueIds.length === product.options.length,
  });

  const singleVariant = product.variants.length === 1 ? product.variants[0] : undefined;
  const effectiveId = resolved?.variantId ?? singleVariant?.id;

  useEffect(() => {
    onResolved?.(effectiveId);
  }, [effectiveId, onResolved]);

  if (!product.options.length) return null;

  return (
    <div className="space-y-4">
      {product.options.map((opt) => (
        <div key={opt.id}>
          <p className="mb-2 text-sm font-medium">{opt.name}</p>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((v) => (
              <Button
                key={v.id}
                type="button"
                size="sm"
                variant={selected[opt.id] === v.id ? 'default' : 'outline'}
                className={cn(selected[opt.id] === v.id && 'ring-2 ring-violet-500')}
                onClick={() => setSelected((s) => ({ ...s, [opt.id]: v.id }))}
              >
                {v.value}
              </Button>
            ))}
          </div>
        </div>
      ))}
      {resolved && (
        <p className="text-sm text-zinc-400">
          SKU {resolved.sku} · <StockBadge available={resolved.available} />
        </p>
      )}
    </div>
  );
}
