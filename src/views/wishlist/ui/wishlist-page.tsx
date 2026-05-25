'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { wishlistApi } from '@/entities/wishlist/api/wishlist-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { Button } from '@/shared/ui/button';
import { PageHeader } from '@/shared/ui/page-header';
import { toast } from 'sonner';

export function WishlistPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: wishlistApi.list,
  });

  const remove = useMutation({
    mutationFn: (productId: string) => wishlistApi.remove(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wishlist });
      toast.success('Eliminado de favoritos');
    },
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader title="Favoritos" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((item) => (
          <div key={item.productId} className="flex gap-4 rounded-lg border border-white/10 p-4">
            {item.primaryImage && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded">
                <Image src={item.primaryImage} alt={item.name} fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="flex-1">
              <Link href={`/products/${item.slug}`} className="font-medium hover:text-violet-400">
                {item.name}
              </Link>
              <p className="text-violet-400">{formatMoney(item.price)}</p>
              <Button size="sm" variant="ghost" className="mt-2" onClick={() => remove.mutate(item.productId)}>
                Quitar
              </Button>
            </div>
          </div>
        ))}
      </div>
      {!data?.length && <p className="text-zinc-500">Tu lista de favoritos está vacía.</p>}
    </div>
  );
}
