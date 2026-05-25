'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AddressPicker } from '@/features/checkout/select-address/ui/address-picker';
import { AddressForm } from '@/features/address/save-address/ui/address-form';
import { CouponField } from '@/features/checkout/apply-coupon/ui/coupon-field';
import { useConfirmOrder } from '@/features/checkout/confirm-order/model/use-confirm-order';
import { OrderSummary } from '@/widgets/order-summary/ui/order-summary';
import { addressApi } from '@/entities/address/api/address-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { useLockBodyScroll } from '@/shared/hooks/use-lock-body-scroll';
import { MAX_USER_ADDRESSES, canAddMoreAddresses } from '@/entities/address/model/constants';
import { toast } from 'sonner';

const SHIPPING_COST = 99;

export function CheckoutShippingPage() {
  const searchParams = useSearchParams();
  const [addressId, setAddressId] = useState<string>();
  const [showForm, setShowForm] = useState(false);
  const [editAddressId, setEditAddressId] = useState<string>();
  const [couponCode, setCouponCode] = useState('');
  const confirm = useConfirmOrder();
  const qc = useQueryClient();

  const { data: addresses } = useQuery({
    queryKey: queryKeys.addresses,
    queryFn: addressApi.list,
  });

  useEffect(() => {
    const fromUrl = searchParams.get('addressId');
    if (fromUrl) setAddressId(fromUrl);
  }, [searchParams]);

  const selectedAddress = useMemo(
    () => addresses?.find((a) => a.id === addressId),
    [addresses, addressId],
  );

  const onConfirm = () => {
    if (!addressId) {
      toast.error('Selecciona una dirección');
      return;
    }
    confirm.mutate({
      addressId,
      shippingCost: SHIPPING_COST,
      couponCode: couponCode.trim() || undefined,
    });
  };

  useLockBodyScroll(showForm);

  const onAddressSaved = (id: string) => {
    qc.invalidateQueries({ queryKey: queryKeys.addresses });
    setAddressId(id);
    setShowForm(false);
    setEditAddressId(undefined);
    toast.success('Dirección guardada');
  };

  return (
    <div
      className={cn(
        'store-page mx-auto w-full max-w-7xl px-4 lg:px-6',
        showForm
          ? '-my-8 flex h-[calc(100dvh-4rem)] max-h-[calc(100dvh-4rem)] flex-col overflow-hidden py-5'
          : 'flex min-h-[calc(100dvh-4rem)] flex-col py-8',
      )}
    >
      <div className="shrink-0">
        <Button variant="ghost" size="sm" className={cn('text-slate-400', showForm ? 'mb-3' : 'mb-6')} asChild>
          <Link href="/cart">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al carrito
          </Link>
        </Button>
        <h1 className={cn('font-bold text-white', showForm ? 'mb-4 text-2xl' : 'mb-8 text-3xl')}>
          Envío y dirección
        </h1>
      </div>

      <div
        className={cn(
          'grid min-h-0 flex-1 gap-6 xl:grid-cols-[minmax(0,1fr)_min(340px,380px)]',
          showForm && 'min-h-0',
        )}
      >
        <div className={cn('min-w-0', showForm ? 'flex min-h-0 flex-col' : 'flex min-h-0 flex-1 flex-col')}>
          {showForm ? (
            <>
              <h2 className="mb-3 shrink-0 text-lg font-semibold text-white">
                {editAddressId ? 'Editar dirección' : 'Nueva dirección'}
              </h2>
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 shadow-lg lg:p-6">
                <AddressForm
                  scrollable
                  addressId={editAddressId}
                  onSaved={onAddressSaved}
                  onCancel={() => {
                    setShowForm(false);
                    setEditAddressId(undefined);
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col gap-6">
              <AddressPicker
                selectedId={addressId}
                onSelect={setAddressId}
                listClassName="max-h-[min(50vh,440px)]"
                onEdit={(id) => {
                  if (!id && !canAddMoreAddresses(addresses?.length ?? 0)) {
                    toast.error(`Solo puedes guardar hasta ${MAX_USER_ADDRESSES} direcciones`);
                    return;
                  }
                  setEditAddressId(id || undefined);
                  setShowForm(true);
                }}
              />
              <div className="shrink-0">
                <CouponField value={couponCode} onChange={setCouponCode} />
              </div>
            </div>
          )}
        </div>

        <div className={cn(showForm && 'shrink-0 self-start')}>
          <OrderSummary
            shippingAmount={SHIPPING_COST}
            selectedAddress={selectedAddress}
            action={
              <Button
                className="mt-2 w-full bg-violet-600 hover:bg-violet-700"
                size="lg"
                onClick={onConfirm}
                disabled={!addressId || confirm.isPending}
              >
                {confirm.isPending ? 'Creando pedido…' : 'Continuar al pago'}
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
