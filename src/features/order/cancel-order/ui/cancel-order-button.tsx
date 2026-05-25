'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/entities/order/api/order-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { canCancelOrder } from '@/shared/lib/order-status';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function CancelOrderButton({ orderId, status }: { orderId: string; status: string }) {
  const qc = useQueryClient();
  const cancel = useMutation({
    mutationFn: () => orderApi.cancel(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.order(orderId) });
      toast.success('Pedido cancelado');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!canCancelOrder(status)) return null;

  return (
    <Button variant="outline" onClick={() => cancel.mutate()} disabled={cancel.isPending}>
      Cancelar pedido
    </Button>
  );
}
