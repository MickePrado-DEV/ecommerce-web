'use client';

import Link from 'next/link';
import { canPayOrder } from '@/shared/lib/order-status';
import { Button } from '@/shared/ui/button';

export function RetryPaymentButton({ orderId, status }: { orderId: string; status: string }) {
  if (!canPayOrder(status)) return null;
  return (
    <Button asChild>
      <Link href={`/checkout/payment/${orderId}`}>Pagar ahora</Link>
    </Button>
  );
}
