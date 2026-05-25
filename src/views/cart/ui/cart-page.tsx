'use client';

import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/entities/cart/api/cart-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { PageHeader } from '@/shared/ui/page-header';
import { EmptyState } from '@/shared/ui/empty-state';
import { Button } from '@/shared/ui/button';
import { QuantityStepper } from '@/features/cart/update-quantity/ui/quantity-stepper';
import { RemoveItemButton } from '@/features/cart/remove-from-cart/ui/remove-item-button';
import { CartSummary } from '@/widgets/cart-summary/ui/cart-summary';
import Link from 'next/link';

export function CartPage() {
  const { data: cart, isLoading } = useQuery({ queryKey: queryKeys.cart, queryFn: cartApi.get });

  if (isLoading) return <p>Cargando carrito…</p>;
  if (!cart?.items.length) {
    return (
      <div className="text-center">
        <EmptyState message="Tu carrito está vacío" />
        <Button className="mt-4" asChild>
          <Link href="/">Seguir comprando</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Carrito" />
      <div className="grid gap-8 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-white/10 p-4"
            >
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-zinc-400">
                  {item.sku} · {formatMoney(item.unitPrice)} c/u
                </p>
              </div>
              <div className="flex items-center gap-4">
                <QuantityStepper itemId={item.id} quantity={item.quantity} />
                <span className="min-w-[4rem] text-right">{formatMoney(item.lineTotal)}</span>
                <RemoveItemButton itemId={item.id} />
              </div>
            </li>
          ))}
        </ul>
        <CartSummary />
      </div>
    </div>
  );
}
