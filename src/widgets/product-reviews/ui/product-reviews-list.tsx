'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewApi } from '@/entities/review/api/review-api';
import { ReviewForm } from '@/features/review/create-review/ui/review-form';
import { queryKeys } from '@/shared/lib/query-keys';
import { StoreCard } from '@/shared/ui/store-card';
import { StarRating } from '@/shared/ui/star-rating';

export function ProductReviewsList({ slug }: { slug: string }) {
  const { data: reviews } = useQuery({
    queryKey: queryKeys.productReviews(slug),
    queryFn: () => reviewApi.list(slug),
  });

  return (
    <section id="reviews">
      <StoreCard>
        <h2 className="text-xl font-semibold text-white">Reseñas</h2>
        {reviews?.summary && reviews.summary.totalCount > 0 && (
          <StarRating
            value={reviews.summary.averageRating}
            count={reviews.summary.totalCount}
            className="mt-3"
          />
        )}
        <div className="mt-6">
          <ReviewForm productSlug={slug} />
        </div>
        <ul className="mt-8 space-y-4">
          {reviews?.items.map((r) => (
            <li key={r.id} className="rounded-xl border border-slate-700/50 bg-slate-950/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-white">{r.authorName}</p>
                <span className="text-sm text-amber-400">{r.rating} ★</span>
              </div>
              {r.title && <p className="mt-1 text-sm font-medium text-slate-300">{r.title}</p>}
              <p className="mt-2 text-sm text-slate-400">{r.comment}</p>
              <p className="mt-2 text-xs text-slate-600">
                {new Date(r.createdAt).toLocaleDateString('es-MX')}
              </p>
            </li>
          ))}
        </ul>
        {!reviews?.items.length && (
          <p className="mt-6 text-sm text-slate-500">Sé el primero en opinar.</p>
        )}
      </StoreCard>
    </section>
  );
}
