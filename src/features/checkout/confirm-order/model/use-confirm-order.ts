'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { orderApi } from '@/entities/order/api/order-api';
import type { CheckoutRequest } from '@/entities/order/model/types';
import { toast } from 'sonner';

export function useConfirmOrder() {
  const router = useRouter();
  return useMutation({
    mutationFn: (body: CheckoutRequest) => orderApi.checkout(body),
    onSuccess: (order) => {
      toast.success('Pedido creado');
      router.push(`/checkout/payment/${order.orderId}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
