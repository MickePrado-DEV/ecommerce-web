'use client';

import { Star, Pencil, Trash2 } from 'lucide-react';
import type { AddressDto } from '@/entities/address/model/types';
import { ADDRESS_TYPES } from '@/entities/address/model/types';
import { StoreCard } from '@/shared/ui/store-card';
import { PillBadge } from '@/shared/ui/pill-badge';
import { Button } from '@/shared/ui/button';
import { LeafletMapStatic } from '@/widgets/leaflet-map/ui/leaflet-map-static';
import { cn } from '@/shared/lib/utils';

function typeLabel(type: number) {
  return ADDRESS_TYPES.find((t) => t.value === type)?.label ?? 'Otra';
}

export function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  showMap = true,
}: {
  address: AddressDto;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  showMap?: boolean;
}) {
  const hasMap = address.latitude != null && address.longitude != null;

  return (
    <StoreCard
      padding={false}
      className={cn(
        'overflow-hidden transition',
        selected && 'ring-2 ring-violet-500/60',
        onSelect && 'cursor-pointer hover:border-violet-500/40',
      )}
      onClick={onSelect}
    >
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <PillBadge variant="info">{typeLabel(address.type).toUpperCase()}</PillBadge>
            {address.isDefault && (
              <PillBadge variant="warning">
                <Star className="mr-1 inline h-3 w-3 fill-current" />
                PREDETERMINADA
              </PillBadge>
            )}
            {selected && <PillBadge variant="success">SELECCIONADA</PillBadge>}
          </div>
        </div>
        <p className="mt-3 font-semibold text-white">{address.label}</p>
        <p className="mt-1 text-sm text-slate-400">
          {address.contactName && <span className="text-slate-300">{address.contactName} · </span>}
          {address.street} {address.externalNumber}
          {address.internalNumber ? ` Int. ${address.internalNumber}` : ''}
        </p>
        <p className="text-sm text-slate-500">
          {address.neighborhood}, {address.municipality ?? address.city}, {address.state} {address.postalCode}
        </p>
        {address.phone && <p className="mt-1 text-sm text-slate-500">{address.phone}</p>}
        <div className="mt-4 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <Button type="button" size="sm" variant="outline" onClick={onEdit}>
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Editar
            </Button>
          )}
          {!address.isDefault && onSetDefault && (
            <Button type="button" size="sm" variant="ghost" onClick={onSetDefault}>
              Predeterminada
            </Button>
          )}
          {onDelete && (
            <Button type="button" size="sm" variant="ghost" className="text-red-400" onClick={onDelete}>
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Eliminar
            </Button>
          )}
        </div>
      </div>
      {showMap && hasMap && (
        <div className="border-t border-slate-700/50 p-3">
          <LeafletMapStatic latitude={address.latitude!} longitude={address.longitude!} />
        </div>
      )}
    </StoreCard>
  );
}
