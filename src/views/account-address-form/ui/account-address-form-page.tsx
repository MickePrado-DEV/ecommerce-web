'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AddressForm } from '@/features/address/save-address/ui/address-form';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { toast } from 'sonner';

function AccountAddressFormContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const qc = useQueryClient();
  const id = params.id as string | undefined;
  const isEdit = Boolean(id) && id !== 'new';
  const fromCheckout = searchParams.get('from') === 'checkout';

  const onSaved = () => {
    qc.invalidateQueries({ queryKey: queryKeys.addresses });
    toast.success('Dirección guardada');
    router.push(fromCheckout ? '/checkout/shipping' : '/account/addresses');
  };

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title={isEdit ? 'Editar dirección' : 'Nueva dirección'} />
      <AddressForm
        addressId={isEdit ? id : undefined}
        onSaved={onSaved}
        onCancel={() => router.push(fromCheckout ? '/checkout/shipping' : '/account/addresses')}
      />
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
