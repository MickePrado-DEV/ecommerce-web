'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { AddressPicker } from '@/features/checkout/select-address/ui/address-picker';
import { AddressForm } from '@/features/address/save-address/ui/address-form';
import { CouponField } from '@/features/checkout/apply-coupon/ui/coupon-field';
import { useConfirmOrder } from '@/features/checkout/confirm-order/model/use-confirm-order';
import { CheckoutOrderSummary } from '@/widgets/checkout-order-summary/ui/checkout-order-summary';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { queryKeys } from '@/shared/lib/query-keys';
import { toast } from 'sonner';

export function CheckoutShippingPage() {
  const [addressId, setAddressId] = useState<string>();
  const [showForm, setShowForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string>();
  const [couponCode, setCouponCode] = useState('');
  const confirm = useConfirmOrder();
  const qc = useQueryClient();

  const onConfirm = () => {
    if (!addressId) {
      toast.error('Selecciona una dirección');
      return;
    }
    confirm.mutate({
      addressId,
      shippingCost: 99,
      couponCode: couponCode.trim() || undefined,
    });
  };

  const onAddressSaved = (id: string) => {
    qc.invalidateQueries({ queryKey: queryKeys.addresses });
    setAddressId(id);
    setShowForm(false);
    setEditAddressId(undefined);
    toast.success('Dirección guardada');
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Envío" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {showForm ? (
            <div>
              <h2 className="mb-4 font-semibold">
                {editAddressId ? 'Editar dirección' : 'Nueva dirección'}
              </h2>
              <AddressForm
                addressId={editAddressId}
                onSaved={onAddressSaved}
                onCancel={() => {
                  setShowForm(false);
                  setEditAddressId(undefined);
                }}
              />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    setEditAddressId(undefined);
                    setShowForm(true);
                  }}
                >
                  Agregar dirección
                </Button>
              </div>
              <AddressPicker
                selectedId={addressId}
                onSelect={setAddressId}
                onEdit={(id) => {
                  setEditAddressId(id || undefined);
                  setShowForm(true);
                }}
              />
            </>
          )}
          {!showForm && (
            <CouponField value={couponCode} onChange={setCouponCode} />
          )}
        </div>
        <CheckoutOrderSummary
          onConfirm={onConfirm}
          confirmDisabled={!addressId}
          confirmLoading={confirm.isPending}
        />
      </div>
      {!showForm && (
        <p className="mt-4 text-center text-sm text-zinc-500">
          También puedes gestionar direcciones en{' '}
          <Link href="/account/addresses" className="text-violet-400 hover:underline">
            tu cuenta
          </Link>
        </p>
      )}
    </div>
  );
}
