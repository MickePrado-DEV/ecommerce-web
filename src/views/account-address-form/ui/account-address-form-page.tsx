'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { addressApi } from '@/entities/address/api/address-api';
import { MAX_USER_ADDRESSES, canAddMoreAddresses } from '@/entities/address/model/constants';
import { toast } from 'sonner';
import { AddressForm } from '@/features/address/save-address/ui/address-form';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';

function AccountAddressFormContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const id = params.id as string | undefined;
  const isEdit = Boolean(id) && id !== 'new';
  const fromCheckout = searchParams.get('from') === 'checkout';

  const { data: addresses } = useQuery({
    queryKey: queryKeys.addresses,
    queryFn: addressApi.list,
    enabled: !isEdit,
  });

  useEffect(() => {
    if (isEdit || !addresses) return;
    if (!canAddMoreAddresses(addresses.length)) {
      toast.error(`Solo puedes guardar hasta ${MAX_USER_ADDRESSES} direcciones`);
      router.replace(fromCheckout ? '/checkout/shipping' : '/account/addresses');
    }
  }, [addresses, isEdit, router, fromCheckout]);

  const onSaved = (_savedId: string) => {
    qc.invalidateQueries({ queryKey: queryKeys.addresses });
    router.push(fromCheckout ? '/checkout/shipping' : '/account/addresses');
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] w-full max-w-4xl flex-col px-4">
      <div className="shrink-0">
        <PageHeader title={isEdit ? 'Editar dirección' : 'Nueva dirección'} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 lg:p-6">
        <AddressForm
          scrollable
          addressId={isEdit ? id : undefined}
          onSaved={onSaved}
          onCancel={() => router.push(fromCheckout ? '/checkout/shipping' : '/account/addresses')}
        />
      </div>
    </div>
  );
}

export function AccountAddressFormPage() {
  return (
    <Suspense>
      <AccountAddressFormContent />
    </Suspense>
  );
}
