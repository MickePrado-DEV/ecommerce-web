'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { addressApi } from '@/entities/address/api/address-api';
import { MAX_USER_ADDRESSES, canAddMoreAddresses } from '@/entities/address/model/constants';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function AccountAddressesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.addresses,
    queryFn: addressApi.list,
  });

  const count = data?.length ?? 0;
  const canAdd = canAddMoreAddresses(count);

  const remove = useMutation({
    mutationFn: addressApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
      toast.success('Dirección elimizada');
    },
  });

  const setDefault = useMutation({
    mutationFn: addressApi.setDefault,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
      toast.success('Dirección predeterminada');
    },
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col">
      <div className="shrink-0">
        <PageHeader
          title="Direcciones"
          action={
            canAdd ? (
              <Button asChild>
                <Link href="/account/addresses/new">Nueva dirección</Link>
              </Button>
            ) : (
              <Button disabled title={`Máximo ${MAX_USER_ADDRESSES} direcciones`}>
                Nueva dirección
              </Button>
            )
          }
        />
        <p className="-mt-4 mb-2 text-sm text-slate-500">
          {count} de {MAX_USER_ADDRESSES} direcciones guardadas
        </p>
      </div>

      <ul className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-1">
        {data?.map((a) => (
          <li key={a.id} className="rounded-lg border border-white/10 p-4">
            <p className="font-medium text-white">
              {a.label}{' '}
              {a.isDefault && <span className="text-xs text-violet-400">(predeterminada)</span>}
            </p>
            <p className="text-sm text-zinc-400">
              {a.street}
              {a.externalNumber ? ` ${a.externalNumber}` : ''}, {a.neighborhood ?? a.municipality}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/account/addresses/${a.id}/edit`}>Editar</Link>
              </Button>
              {!a.isDefault && (
                <Button size="sm" variant="outline" onClick={() => setDefault.mutate(a.id)}>
                  Predeterminada
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => remove.mutate(a.id)}>
                Eliminar
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
