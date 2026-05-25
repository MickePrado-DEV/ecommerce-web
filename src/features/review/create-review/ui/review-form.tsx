'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from '@/entities/review/api/review-api';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';

const schema = z.object({
  rating: z.coerce.number().min(1).max(5),
  title: z.string().optional(),
  comment: z.string().min(3, 'Mínimo 3 caracteres'),
});

export function ReviewForm({ productSlug }: { productSlug: string }) {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const form = useForm({ resolver: zodResolver(schema), defaultValues: { rating: 5, title: '', comment: '' } });

  const create = useMutation({
    mutationFn: (data: z.infer<typeof schema>) => reviewApi.create(productSlug, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.productReviews(productSlug) });
      toast.success('Reseña publicada');
      form.reset({ rating: 5, title: '', comment: '' });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!user) {
    return (
      <p className="text-sm text-zinc-500">
        <Link href={`/login?redirect=/products/${productSlug}`} className="text-violet-400 hover:underline">
          Inicia sesión
        </Link>
        {' '}para dejar una reseña.
      </p>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((d) => create.mutate(d))} className="max-w-md space-y-4 rounded-lg border border-white/10 p-4">
      <div>
        <Label>Valoración (1-5)</Label>
        <Input type="number" min={1} max={5} {...form.register('rating')} />
      </div>
      <div>
        <Label>Título (opcional)</Label>
        <Input {...form.register('title')} />
      </div>
      <div>
        <Label>Comentario</Label>
        <Input {...form.register('comment')} />
      </div>
      <Button type="submit" size="sm" disabled={create.isPending}>
        Publicar reseña
      </Button>
    </form>
  );
}
