'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { AddressForm } from '@/features/address/save-address/ui/address-form';
import { addressApi } from '@/entities/address/api/address-api';
import { MAX_USER_ADDRESSES, canAddMoreAddresses } from '@/entities/address/model/constants';
import { Button } from '@/shared/ui/button';
import { queryKeys } from '@/shared/lib/query-keys';
import { toast } from 'sonner';

export function CheckoutAddressNewPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { data: addresses } = useQuery({
    queryKey: queryKeys.addresses,
    queryFn: addressApi.list,
  });

  useEffect(() => {
    if (addresses && !canAddMoreAddresses(addresses.length)) {
      toast.error(`Solo puedes guardar hasta ${MAX_USER_ADDRESSES} direcciones`);
      router.replace('/checkout/shipping');
    }
  }, [addresses, router]);

  return (
    <div className="store-page flex h-[calc(100vh-4rem)] flex-col px-4 py-6">
      <div className="mx-auto flex w-full max-w-4xl min-h-0 flex-1 flex-col">
        <div className="shrink-0">
          <Button variant="ghost" size="sm" className="mb-4 text-slate-400" asChild>
            <Link href="/checkout/shipping">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al envío
            </Link>
          </Button>
          <h1 className="mb-4 text-2xl font-bold text-white">Nueva dirección</h1>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 shadow-lg lg:p-6">
          <AddressForm
            scrollable
            onSaved={(id) => {
              qc.invalidateQueries({ queryKey: queryKeys.addresses });
              router.push(`/checkout/shipping?addressId=${id}`);
            }}
            onCancel={() => router.push('/checkout/shipping')}
          />
        </div>
      </div>
    </div>
  );
}
