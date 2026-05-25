import { Suspense } from 'react';
import { CheckoutShippingPage } from '@/views/checkout-shipping';

export default function Page() {
  return (
    <Suspense fallback={<p className="store-page p-8 text-slate-500">Cargando envío…</p>}>
      <CheckoutShippingPage />
    </Suspense>
  );
}
