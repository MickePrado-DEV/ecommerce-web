'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { addressApi } from '@/entities/address/api/address-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

/** Equivalente Livewire AddressList + sync selectedAddressId con el padre. */
export function AddressPicker({
  selectedId,
  onSelect,
  onEdit,
}: {
  selectedId?: string;
  onSelect: (id: string | undefined) => void;
  /** Si se define, "Editar" abre formulario inline (Checkout). */
  onEdit?: (id: string) => void;
}) {
  const qc = useQueryClient();
  const { data: addresses, isLoading } = useQuery({
    queryKey: queryKeys.addresses,
    queryFn: addressApi.list,
  });

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

  if (isLoading) return <p className="text-sm text-zinc-500">Cargando direcciones…</p>;

  if (!addresses?.length) {
    return (
      <p className="text-sm text-amber-400">
        No tienes direcciones.{' '}
        {onEdit ? (
          <button type="button" className="underline" onClick={() => onEdit('')}>
            Crear una
          </button>
        ) : (
          <Link href="/account/addresses/new?from=checkout" className="underline">
            Crear una
          </Link>
        )}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Dirección de envío</h2>
        {onEdit ? (
          <Button size="sm" variant="outline" onClick={() => onEdit('')}>
            Agregar dirección
          </Button>
        ) : (
          <Button size="sm" variant="outline" asChild>
            <Link href="/account/addresses/new?from=checkout">Agregar dirección</Link>
          </Button>
        )}
      </div>
      {addresses.map((a) => (
        <label
          key={a.id}
          className="flex cursor-pointer gap-3 rounded-lg border border-white/10 p-4 hover:border-violet-500/50 has-[:checked]:border-violet-500"
        >
          <input
            type="radio"
            name="address"
            checked={selectedId === a.id}
            onChange={() => onSelect(a.id)}
            className="mt-1"
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium">
              {a.label}
              {a.isDefault && <span className="ml-2 text-xs text-violet-400">(predeterminada)</span>}
            </p>
            <p className="text-sm text-zinc-400">
              {a.street}
              {a.externalNumber ? ` ${a.externalNumber}` : ''}
              {a.neighborhood ? `, ${a.neighborhood}` : ''} — {a.municipality ?? a.city}, {a.state}{' '}
              {a.postalCode}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.preventDefault();
                  if (onEdit) onEdit(a.id);
                  else window.location.href = `/account/addresses/${a.id}/edit?from=checkout`;
                }}
              >
                Editar
              </Button>
              {!a.isDefault && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    setDefault.mutate(a.id);
                  }}
                >
                  Predeterminada
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-red-400"
                onClick={(e) => {
                  e.preventDefault();
                  remove.mutate(a.id);
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}
