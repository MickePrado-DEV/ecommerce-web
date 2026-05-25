'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { orderApi } from '@/entities/order/api/order-api';
import type { CheckoutRequest } from '@/entities/order/model/types';
import { queryKeys } from '@/shared/lib/query-keys';
import { toast } from 'sonner';

export function useConfirmOrder() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CheckoutRequest) => orderApi.checkout(body),
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: queryKeys.cart });
      toast.success('Pedido creado');
      router.push(`/checkout/payment/${order.orderId}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
