'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Truck } from 'lucide-react';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { reviewApi } from '@/entities/review/api/review-api';
import { cartApi } from '@/entities/cart/api/cart-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import { StarRating } from '@/shared/ui/star-rating';
import { QuantityStepperUI } from '@/shared/ui/quantity-stepper-ui';
import { PillBadge } from '@/shared/ui/pill-badge';
import { StoreCard } from '@/shared/ui/store-card';
import { Alert } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { VariantSelector } from '@/entities/product/ui/variant-selector';
import { WishlistButton } from '@/features/wishlist/toggle-wishlist/ui/wishlist-button';
import { ProductReviewsList } from '@/widgets/product-reviews/ui/product-reviews-list';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [variantId, setVariantId] = useState<string>();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const qc = useQueryClient();

  const { data: product, isLoading } = useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => catalogApi.getProduct(slug),
  });

  const { data: reviews } = useQuery({
    queryKey: queryKeys.productReviews(slug),
    queryFn: () => reviewApi.list(slug),
  });

  const addCart = useMutation({
    mutationFn: () => cartApi.addItem({ variantId: variantId!, quantity: qty }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cart });
      setAdded(true);
      toast.success('Producto agregado al carrito.');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading || !product) {
    return (
      <div className="store-page mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="mb-6 h-10 w-full max-w-xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  const avg = reviews?.summary?.averageRating ?? 0;
  const reviewCount = reviews?.summary?.totalCount ?? 0;
  const resolvedVariant = product.variants.find((v) => v.id === variantId);
  const inStock = (resolvedVariant?.available ?? product.variants[0]?.available ?? 0) > 0;

  return (
    <div className="store-page mx-auto max-w-6xl space-y-10 px-4 py-8">
      <Breadcrumb items={[{ label: product.name }]} />

      <div className="grid gap-10 lg:grid-cols-2">
        <StoreCard padding={false} className="overflow-hidden">
          <div className="relative aspect-square bg-slate-950">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-600">Sin imagen</div>
            )}
          </div>
        </StoreCard>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
            {reviewCount > 0 ? (
              <StarRating value={avg} count={reviewCount} className="mt-3" />
            ) : (
              <p className="mt-3 text-sm text-slate-500">Sin reseñas aún</p>
            )}
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-bold text-violet-400">
              {formatMoney(resolvedVariant?.price ?? product.basePrice)}
            </span>
          </div>

          {product.description && (
            <p className="text-slate-400 leading-relaxed">{product.description}</p>
          )}

          <VariantSelector product={product} slug={slug} onResolved={setVariantId} />

          <div className="flex flex-wrap items-center gap-3">
            <QuantityStepperUI value={qty} onChange={setQty} max={resolvedVariant?.available ?? 99} />
            {inStock ? (
              <PillBadge variant="success">En stock</PillBadge>
            ) : (
              <PillBadge variant="warning">Agotado</PillBadge>
            )}
            <PillBadge variant="info">
              <Truck className="mr-1 inline h-3 w-3" />
              Envío rápido
            </PillBadge>
          </div>

          {added && (
            <Alert variant="success" onDismiss={() => setAdded(false)}>
              Producto agregado al carrito.
            </Alert>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="w-full bg-violet-600 hover:bg-violet-700 sm:flex-1"
              disabled={!variantId || !inStock || addCart.isPending}
              onClick={() => addCart.mutate()}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Agregar al carrito
            </Button>
            <WishlistButton productId={product.id} slug={slug} />
          </div>
        </div>
      </div>

      <ProductReviewsList slug={slug} />
    </div>
  );
}
