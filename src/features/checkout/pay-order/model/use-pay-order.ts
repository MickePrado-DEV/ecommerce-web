'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { orderApi } from '@/entities/order/api/order-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { toast } from 'sonner';

export function usePayOrder(orderId: string) {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => orderApi.pay(orderId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cart });
      toast.success('Pago simulado correcto');
      router.push(`/checkout/success/${orderId}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
