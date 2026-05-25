'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/entities/cart/api/cart-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';

export function QuantityStepper({ itemId, quantity }: { itemId: string; quantity: number }) {
  const qc = useQueryClient();
  const update = useMutation({
    mutationFn: (qty: number) => cartApi.updateItem(itemId, qty),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart }),
  });

  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="outline"
        disabled={quantity <= 1 || update.isPending}
        onClick={() => update.mutate(quantity - 1)}
      >
        −
      </Button>
      <span className="w-8 text-center text-sm">{quantity}</span>
      <Button size="sm" variant="outline" disabled={update.isPending} onClick={() => update.mutate(quantity + 1)}>
        +
      </Button>
    </div>
  );
}
