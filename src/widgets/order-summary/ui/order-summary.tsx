'use client';

import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/entities/cart/api/cart-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { StoreCard } from '@/shared/ui/store-card';
import { Button } from '@/shared/ui/button';
import { LeafletMapStatic } from '@/widgets/leaflet-map/ui/leaflet-map-static';
import type { AddressDto } from '@/entities/address/model/types';

export function OrderSummary({
  shippingLabel = 'Por calcular al pagar',
  shippingAmount,
  action,
  selectedAddress,
  showItems = true,
}: {
  shippingLabel?: string;
  shippingAmount?: number;
  action?: React.ReactNode;
  selectedAddress?: AddressDto | null;
  showItems?: boolean;
}) {
  const { data: cart, isLoading } = useQuery({ queryKey: queryKeys.cart, queryFn: cartApi.get });

  if (isLoading) {
    return (
      <StoreCard>
        <p className="text-sm text-slate-500">Cargando resumen…</p>
      </StoreCard>
    );
  }

  const subtotal = cart?.subtotal ?? 0;
  const shipping = shippingAmount ?? 0;
  const total = subtotal + shipping;

  return (
    <StoreCard className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Resumen del pedido</h3>
      {showItems && cart?.items.length ? (
        <ul className="space-y-3 border-b border-slate-700/50 pb-4">
          {cart.items.map((item) => (
            <li key={item.id} className="flex gap-3 text-sm">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs text-slate-600">
                IMG
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-200">{item.productName}</p>
                <p className="text-slate-500">
                  {item.sku} · ×{item.quantity}
                </p>
                <p className="text-violet-400">{formatMoney(item.lineTotal)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">Sin artículos en el carrito</p>
      )}
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between text-slate-400">
          <dt>Subtotal</dt>
          <dd className="text-slate-200">{formatMoney(subtotal)}</dd>
        </div>
        <div className="flex justify-between text-slate-400">
          <dt>Envío</dt>
          <dd className="text-slate-200">
            {shippingAmount !== undefined ? formatMoney(shipping) : shippingLabel}
          </dd>
        </div>
        <div className="flex justify-between border-t border-slate-700/50 pt-2 text-base font-semibold">
          <dt className="text-white">Total</dt>
          <dd className="text-violet-400">{formatMoney(total)}</dd>
        </div>
      </dl>
      {selectedAddress && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-950/50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Dirección de envío</p>
          <p className="mt-1 text-sm text-slate-300">{selectedAddress.label}</p>
          <p className="text-xs text-slate-500">
            {selectedAddress.street} {selectedAddress.externalNumber}, {selectedAddress.municipality ?? selectedAddress.city}
          </p>
          {selectedAddress.latitude != null && selectedAddress.longitude != null && (
            <div className="mt-2">
              <LeafletMapStatic
                latitude={selectedAddress.latitude}
                longitude={selectedAddress.longitude}
                heightClass="h-28"
              />
            </div>
          )}
        </div>
      )}
      {action}
    </StoreCard>
  );
}
