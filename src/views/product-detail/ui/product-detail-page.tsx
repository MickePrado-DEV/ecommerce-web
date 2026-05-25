'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { catalogApi } from '@/entities/catalog/api/catalog-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PriceTag } from '@/shared/ui/price-tag';
import { Skeleton } from '@/shared/ui/skeleton';
import { VariantSelector } from '@/entities/product/ui/variant-selector';
import { AddToCartButton } from '@/features/cart/add-to-cart/ui/add-to-cart-button';
import { WishlistButton } from '@/features/wishlist/toggle-wishlist/ui/wishlist-button';
import { ProductReviewsList } from '@/widgets/product-reviews/ui/product-reviews-list';
import Image from 'next/image';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [variantId, setVariantId] = useState<string>();

  const { data: product, isLoading } = useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => catalogApi.getProduct(slug),
  });

  if (isLoading || !product) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10">
          {product.images[0] && (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" unoptimized />
          )}
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-zinc-400">{product.description}</p>
          <PriceTag amount={product.basePrice} className="text-2xl" />
          <VariantSelector product={product} slug={slug} onResolved={setVariantId} />
          <div className="flex flex-wrap gap-3">
            <AddToCartButton variantId={variantId} />
            <WishlistButton productId={product.id} slug={slug} />
          </div>
        </div>
      </div>
      <ProductReviewsList slug={slug} />
    </div>
  );
}
