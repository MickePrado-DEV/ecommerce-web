'use client';

import { useQuery } from '@tanstack/react-query';
import { addressApi } from '@/entities/address/api/address-api';
import { queryKeys } from '@/shared/lib/query-keys';
import Link from 'next/link';

export function AddressPicker({
  selectedId,
  onSelect,
}: {
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const { data: addresses, isLoading } = useQuery({
    queryKey: queryKeys.addresses,
    queryFn: addressApi.list,
  });

  if (isLoading) return <p className="text-sm text-zinc-500">Cargando direcciones…</p>;

  if (!addresses?.length) {
    return (
      <p className="text-sm text-amber-400">
        No tienes direcciones.{' '}
        <Link href="/account/addresses/new" className="underline">
          Crear una
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-3">
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
          />
          <div>
            <p className="font-medium">
              {a.label}
              {a.isDefault && <span className="ml-2 text-xs text-violet-400">(predeterminada)</span>}
            </p>
            <p className="text-sm text-zinc-400">
              {a.street}, {a.city}
            </p>
          </div>
        </label>
      ))}
    </div>
  );
}
