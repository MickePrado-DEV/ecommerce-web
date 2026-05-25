'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { addressApi } from '@/entities/address/api/address-api';
import { MAX_USER_ADDRESSES, canAddMoreAddresses } from '@/entities/address/model/constants';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { AddressCard } from '@/widgets/address-card/ui/address-card';
import { cn } from '@/shared/lib/utils';
import { toast } from 'sonner';

export function AddressPicker({
  selectedId,
  onSelect,
  onEdit,
  listClassName,
}: {
  selectedId?: string;
  onSelect: (id: string | undefined) => void;
  onEdit?: (id: string) => void;
  /** Altura máxima del listado con scroll interno. */
  listClassName?: string;
}) {
  const qc = useQueryClient();
  const { data: addresses, isLoading } = useQuery({
    queryKey: queryKeys.addresses,
    queryFn: addressApi.list,
  });

  const count = addresses?.length ?? 0;
  const canAdd = canAddMoreAddresses(count);

  useEffect(() => {
    if (!addresses?.length) return;
    if (selectedId && addresses.some((a) => a.id === selectedId)) return;
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    onSelect(def.id);
  }, [addresses, selectedId, onSelect]);

  const setDefault = useMutation({
    mutationFn: addressApi.setDefault,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
      onSelect(id);
      toast.success('Dirección predeterminada');
    },
  });

  const remove = useMutation({
    mutationFn: addressApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.addresses });
      toast.success('Dirección eliminada');
    },
  });

  const tryAdd = () => {
    if (!canAdd) {
      toast.error(`Solo puedes guardar hasta ${MAX_USER_ADDRESSES} direcciones`);
      return;
    }
    onEdit?.('');
  };

  if (isLoading) return <p className="text-sm text-slate-500">Cargando direcciones…</p>;

  if (!addresses?.length) {
    return (
      <p className="text-sm text-amber-400">
        No tienes direcciones.{' '}
        {onEdit ? (
          <button type="button" className="underline" onClick={tryAdd}>
            Crear una
          </button>
        ) : (
          <Link href="/checkout/shipping/new" className="underline">
            Crear una
          </Link>
        )}
      </p>
    );
  }

  const defaultAddr = addresses.find((a) => a.isDefault);
  const others = addresses.filter(
    (a) => !(defaultAddr && a.id === defaultAddr.id && addresses.length > 1),
  );

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-white">Mis direcciones</h2>
          <p className="text-xs text-slate-500">
            {count} de {MAX_USER_ADDRESSES} direcciones
          </p>
        </div>
        {onEdit ? (
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700"
            disabled={!canAdd}
            onClick={tryAdd}
          >
            <Plus className="mr-1 h-4 w-4" />
            Agregar dirección
          </Button>
        ) : (
          <Button
            size="sm"
            className="bg-violet-600 hover:bg-violet-700"
            disabled={!canAdd}
            asChild={canAdd}
          >
            {canAdd ? (
              <Link href="/checkout/shipping/new">
                <Plus className="mr-1 h-4 w-4" />
                Agregar dirección
              </Link>
            ) : (
              <span>
                <Plus className="mr-1 h-4 w-4" />
                Agregar dirección
              </span>
            )}
          </Button>
        )}
      </div>

      <div
        className={cn(
          'min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain pr-1',
          listClassName ?? 'max-h-[min(55vh,480px)]',
        )}
      >
        {defaultAddr && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Dirección predeterminada
            </p>
            <AddressCard
              address={defaultAddr}
              selected={selectedId === defaultAddr.id}
              onSelect={() => onSelect(defaultAddr.id)}
              onEdit={onEdit ? () => onEdit(defaultAddr.id) : undefined}
              onDelete={() => remove.mutate(defaultAddr.id)}
            />
          </div>
        )}

        {others.length > 0 && (
          <div className="space-y-3">
            {others.map((a) => (
              <AddressCard
                key={a.id}
                address={a}
                selected={selectedId === a.id}
                onSelect={() => onSelect(a.id)}
                onEdit={onEdit ? () => onEdit(a.id) : undefined}
                onDelete={() => remove.mutate(a.id)}
                onSetDefault={!a.isDefault ? () => setDefault.mutate(a.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
