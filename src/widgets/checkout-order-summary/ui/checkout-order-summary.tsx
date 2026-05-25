'use client';

import { CartSummary } from '@/widgets/cart-summary/ui/cart-summary';

export function CheckoutOrderSummary() {
  return <CartSummary showCheckoutLink={false} />;
}
