'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/entities/cart/api/cart-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function AddToCartButton({ variantId, disabled }: { variantId?: string; disabled?: boolean }) {
  const qc = useQueryClient();
  const [qty, setQty] = useState(1);
  const mutation = useMutation({
    mutationFn: () => cartApi.addItem({ variantId: variantId!, quantity: qty }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cart });
      toast.success('Agregado al carrito');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="flex flex-wrap gap-2">
      <input
        type="number"
        min={1}
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
        className="w-16 rounded border border-white/10 bg-transparent px-2 py-2 text-sm"
        aria-label="Cantidad"
      />
      <Button disabled={!variantId || disabled} onClick={() => mutation.mutate()}>
        Agregar al carrito
      </Button>
    </div>
  );
}
