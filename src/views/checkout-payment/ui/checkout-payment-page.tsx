'use client';

import { useParams } from 'next/navigation';
import { usePayOrder } from '@/features/checkout/pay-order/model/use-pay-order';
import { PaymentMockForm } from '@/features/checkout/pay-order/ui/payment-mock-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function CheckoutPaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const pay = usePayOrder(orderId);

  return (
    <Card className="mx-auto max-w-lg border-white/10 bg-white/5">
      <CardHeader>
        <CardTitle>Pago simulado</CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentMockForm onPay={() => pay.mutate()} loading={pay.isPending} />
      </CardContent>
    </Card>
  );
}
