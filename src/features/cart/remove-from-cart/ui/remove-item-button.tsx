'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/entities/cart/api/cart-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';

export function RemoveItemButton({ itemId }: { itemId: string }) {
  const qc = useQueryClient();
  const remove = useMutation({
    mutationFn: () => cartApi.removeItem(itemId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart }),
  });

  return (
    <Button variant="ghost" size="sm" onClick={() => remove.mutate()} disabled={remove.isPending}>
      Quitar
    </Button>
  );
}
