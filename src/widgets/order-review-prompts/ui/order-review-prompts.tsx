'use client';

import Link from 'next/link';
import { useQueries } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { reviewApi } from '@/entities/review/api/review-api';
import { queryKeys } from '@/shared/lib/query-keys';
import type { OrderItemDto } from '@/entities/order/model/types';
import { StoreCard } from '@/shared/ui/store-card';
import { Button } from '@/shared/ui/button';

export function OrderReviewPrompts({
  items,
  orderStatus,
}: {
  items: OrderItemDto[];
  orderStatus: string;
}) {
  if (orderStatus !== 'Delivered') return null;

  const slugs = [
    ...new Map(
      items
        .filter((i) => i.productSlug)
        .map((i) => [i.productSlug!, { slug: i.productSlug!, name: i.productName }]),
    ).values(),
  ];

  if (!slugs.length) return null;

  const eligibilityQueries = useQueries({
    queries: slugs.map((p) => ({
      queryKey: queryKeys.productReviewEligibility(p.slug),
      queryFn: () => reviewApi.eligibility(p.slug),
    })),
  });

  const reviewable = slugs.filter((_, i) => eligibilityQueries[i].data?.canReview);

  if (!reviewable.length) return null;

  return (
    <StoreCard>
      <h2 className="mb-2 flex items-center gap-2 font-semibold text-white">
        <Star className="h-5 w-5 text-amber-400" />
        Valora tu compra
      </h2>
      <p className="mb-4 text-sm text-slate-400">
        Tu pedido fue entregado. Puedes dejar una reseña por producto (una vez por artículo).
      </p>
      <ul className="space-y-2">
        {reviewable.map((p) => (
          <li
            key={p.slug}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/50 bg-slate-950/40 px-4 py-3"
          >
            <span className="text-sm text-slate-200">{p.name}</span>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700" asChild>
              <Link href={`/products/${p.slug}#reviews`}>Dejar reseña</Link>
            </Button>
          </li>
        ))}
      </ul>
    </StoreCard>
  );
}
