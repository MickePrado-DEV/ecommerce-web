'use client';

import { useState } from 'react';
import { AddressPicker } from '@/features/checkout/select-address/ui/address-picker';
import { CouponField } from '@/features/checkout/apply-coupon/ui/coupon-field';
import { useConfirmOrder } from '@/features/checkout/confirm-order/model/use-confirm-order';
import { CheckoutOrderSummary } from '@/widgets/checkout-order-summary/ui/checkout-order-summary';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function CheckoutShippingPage() {
  const [addressId, setAddressId] = useState<string>();
  const [couponCode, setCouponCode] = useState('WELCOME10');
  const confirm = useConfirmOrder();

  const onConfirm = () => {
    if (!addressId) {
      toast.error('Selecciona una dirección');
      return;
    }
    confirm.mutate({
      addressId,
      shippingCost: 99,
      couponCode: couponCode || undefined,
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Envío y cupón" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <AddressPicker selectedId={addressId} onSelect={setAddressId} />
          <CouponField value={couponCode} onChange={setCouponCode} />
        </div>
        <CheckoutOrderSummary />
        <Button
          className="lg:col-span-3"
          onClick={onConfirm}
          disabled={!addressId || confirm.isPending}
        >
          Confirmar pedido
        </Button>
      </div>
    </div>
  );
}
