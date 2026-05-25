'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewApi } from '@/entities/review/api/review-api';
import { ReviewForm } from '@/features/review/create-review/ui/review-form';
import { queryKeys } from '@/shared/lib/query-keys';

export function ProductReviewsList({ slug }: { slug: string }) {
  const { data: reviews } = useQuery({
    queryKey: queryKeys.productReviews(slug),
    queryFn: () => reviewApi.list(slug),
  });

  return (
    <section className="mt-12 border-t border-white/10 pt-8">
      <h2 className="mb-4 text-xl font-semibold">Reseñas</h2>
      {reviews?.summary && (
        <p className="mb-4 text-sm text-zinc-400">
          {reviews.summary.averageRating.toFixed(1)} ★ · {reviews.summary.totalCount} opiniones
        </p>
      )}
      <ReviewForm productSlug={slug} />
      <ul className="mt-6 space-y-4">
        {reviews?.items.map((r) => (
          <li key={r.id} className="rounded-lg border border-white/10 p-4">
            <p className="font-medium">
              {r.authorName} · {r.rating}★
            </p>
            {r.title && <p className="text-sm">{r.title}</p>}
            <p className="text-sm text-zinc-400">{r.comment}</p>
          </li>
        ))}
      </ul>
      {!reviews?.items.length && (
        <p className="mt-4 text-sm text-zinc-500">Sé el primero en opinar.</p>
      )}
    </section>
  );
}
