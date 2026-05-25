'use client';

import { useParams, useRouter } from 'next/navigation';
import { orderApi } from '@/entities/order/api/order-api';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { toast } from 'sonner';

export function CheckoutPaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const pay = async () => {
    try {
      await orderApi.pay(orderId);
      toast.success('Pago simulado correcto');
      router.push(`/checkout/success/${orderId}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error al pagar');
    }
  };

  return (
    <Card className="mx-auto max-w-lg border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle>Pago simulado</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-400">El API genera referencia MOCK-*. Sin pasarela real.</p>
        <Button className="w-full" onClick={pay}>Pagar ahora</Button>
      </CardContent>
    </Card>
  );
}
