'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { addressApi } from '@/entities/address/api/address-api';
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

  const remove = useMutation({
    mutationFn: addressApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
      toast.success('Dirección eliminada');
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
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Direcciones"
        action={
          <Button asChild><Link href="/account/addresses/new">Nueva dirección</Link></Button>
        }
      />
      <ul className="space-y-4">
        {data?.map((a) => (
          <li key={a.id} className="rounded-lg border border-white/10 p-4">
            <p className="font-medium">{a.label} {a.isDefault && <span className="text-xs text-violet-400">(predeterminada)</span>}</p>
            <p className="text-sm text-zinc-400">{a.street}, {a.city}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" variant="outline" asChild><Link href={`/account/addresses/${a.id}/edit`}>Editar</Link></Button>
              {!a.isDefault && (
                <Button size="sm" variant="outline" onClick={() => setDefault.mutate(a.id)}>Predeterminada</Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => remove.mutate(a.id)}>Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
