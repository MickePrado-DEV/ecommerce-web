'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '@/entities/review/api/review-api';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { StarRatingInput } from '@/shared/ui/star-rating-input';
import { Alert } from '@/shared/ui/alert';
import { toast } from 'sonner';
import Link from 'next/link';

const schema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(3, 'Mínimo 3 caracteres'),
});

export function ReviewForm({ productSlug }: { productSlug: string }) {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5, title: '', comment: '' },
  });

  const { data: eligibility, isLoading: loadingEligibility } = useQuery({
    queryKey: queryKeys.productReviewEligibility(productSlug),
    queryFn: () => reviewApi.eligibility(productSlug),
    enabled: !!user,
  });

  const create = useMutation({
    mutationFn: (data: z.infer<typeof schema>) => reviewApi.create(productSlug, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.productReviews(productSlug) });
      qc.invalidateQueries({ queryKey: queryKeys.productReviewEligibility(productSlug) });
      toast.success('Reseña publicada');
      form.reset({ rating: 5, title: '', comment: '' });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!user) {
    return (
      <p className="text-sm text-slate-500">
        <Link href={`/login?redirect=/products/${productSlug}`} className="text-violet-400 hover:underline">
          Inicia sesión
        </Link>{' '}
        para dejar una reseña.
      </p>
    );
  }

  if (loadingEligibility) {
    return <p className="text-sm text-slate-500">Comprobando si puedes reseñar…</p>;
  }

  if (eligibility && !eligibility.canReview) {
    return (
      <Alert variant="info">
        {eligibility.message ??
          (eligibility.alreadyReviewed
            ? 'Ya publicaste tu reseña para este producto.'
            : 'Podrás reseñar cuando recibas el producto en un pedido entregado.')}
      </Alert>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit((d) => create.mutate(d))}
      className="max-w-lg space-y-4 rounded-xl border border-slate-700/50 bg-slate-950/40 p-4"
    >
      <p className="text-xs text-emerald-400/90">
        Compraste y recibiste este producto. Tu opinión ayuda a otros clientes.
      </p>
      <div>
        <Label className="mb-2 block">Valoración</Label>
        <Controller
          control={form.control}
          name="rating"
          render={({ field }) => (
            <StarRatingInput value={field.value} onChange={field.onChange} disabled={create.isPending} />
          )}
        />
      </div>
      <div>
        <Label>Título (opcional)</Label>
        <Input {...form.register('title')} className="mt-1 border-slate-700 bg-slate-900" />
      </div>
      <div>
        <Label>Comentario</Label>
        <textarea
          {...form.register('comment')}
          rows={3}
          className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
        />
      </div>
      <Button type="submit" size="sm" className="bg-violet-600 hover:bg-violet-700" disabled={create.isPending}>
        Publicar reseña
      </Button>
    </form>
  );
}
