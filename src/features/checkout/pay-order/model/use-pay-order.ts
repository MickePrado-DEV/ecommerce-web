'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { orderApi } from '@/entities/order/api/order-api';
import { toast } from 'sonner';

export function usePayOrder(orderId: string) {
  const router = useRouter();
  return useMutation({
    mutationFn: () => orderApi.pay(orderId),
    onSuccess: () => {
      toast.success('Pago simulado correcto');
      router.push(`/checkout/success/${orderId}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
