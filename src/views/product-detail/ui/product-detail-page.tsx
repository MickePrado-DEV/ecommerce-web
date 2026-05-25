'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { cartApi } from '@/entities/cart/api/cart-api';
import { wishlistApi } from '@/entities/wishlist/api/wishlist-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { toast } from 'sonner';
import Image from 'next/image';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [variantId, setVariantId] = useState<string>();

  const { data: product, isLoading } = useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => catalogApi.getProduct(slug),
  });

  const optionIds = Object.values(selected);
  useQuery({
    queryKey: ['resolve', slug, optionIds.join(',')],
    queryFn: async () => {
      const v = await catalogApi.resolveVariant(slug, optionIds);
      setVariantId(v.variantId);
      return v;
    },
    enabled: product != null && product.options.length > 0 && optionIds.length === product.options.length,
  });

  const addCart = useMutation({
    mutationFn: () => cartApi.addItem({ variantId: variantId!, quantity: 1 }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cart });
      toast.success('Agregado al carrito');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addWish = useMutation({
    mutationFn: () => wishlistApi.add(product!.id),
    onSuccess: () => toast.success('Agregado a favoritos'),
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !product) return <Skeleton className="h-96 w-full" />;

  const effectiveVariant =
    variantId ?? (product.variants.length === 1 ? product.variants[0].id : undefined);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10">
        {product.images[0] && (
          <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized />
        )}
      </div>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-zinc-400">{product.description}</p>
        <p className="text-2xl font-semibold text-violet-400">{formatMoney(product.basePrice)}</p>

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
                  onClick={() => setSelected((s) => ({ ...s, [opt.id]: v.id }))}
                >
                  {v.value}
                </Button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-3">
          <Button disabled={!effectiveVariant} onClick={() => addCart.mutate()}>
            Agregar al carrito
          </Button>
          <Button variant="outline" onClick={() => addWish.mutate()}>
            Favoritos
          </Button>
        </div>
      </div>
    </div>
  );
}
