'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { cartApi } from '@/entities/cart/api/cart-api';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { StoreCard } from '@/shared/ui/store-card';
import { EmptyState } from '@/shared/ui/empty-state';
import { Button } from '@/shared/ui/button';
import { QuantityStepper } from '@/features/cart/update-quantity/ui/quantity-stepper';
import { RemoveItemButton } from '@/features/cart/remove-from-cart/ui/remove-item-button';
import { OrderSummary } from '@/widgets/order-summary/ui/order-summary';

export function CartPage() {
  const user = useAuthStore((s) => s.user);
  const { data: cart, isLoading } = useQuery({ queryKey: queryKeys.cart, queryFn: cartApi.get });

  const checkoutHref = user
    ? '/checkout/shipping'
    : `/login?redirect=${encodeURIComponent('/checkout/shipping')}`;

  if (isLoading) return <p className="store-page p-8 text-slate-500">Cargando carrito…</p>;

  if (!cart?.items.length) {
    return (
      <div className="store-page mx-auto max-w-lg px-4 py-16 text-center">
        <EmptyState message="Tu carrito está vacío" />
        <Button className="mt-6 bg-violet-600 hover:bg-violet-700" asChild>
          <Link href="/">Seguir comprando</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="store-page mx-auto max-w-6xl px-4 py-8">
      <Button variant="ghost" size="sm" className="mb-6 text-slate-400" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Seguir comprando
        </Link>
      </Button>

      <h1 className="mb-8 text-3xl font-bold text-white">Carrito</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.items.map((item) => (
            <StoreCard key={item.id} className="flex flex-wrap gap-4 sm:flex-nowrap">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                <div className="flex h-full items-center justify-center text-xs text-slate-600">IMG</div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">{item.productName}</p>
                <p className="text-sm text-slate-500">SKU {item.sku}</p>
                <p className="mt-1 text-violet-400">{formatMoney(item.unitPrice)} c/u</p>
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <QuantityStepper itemId={item.id} quantity={item.quantity} />
                  <span className="font-semibold text-slate-200">{formatMoney(item.lineTotal)}</span>
                  <RemoveItemButton itemId={item.id} />
                </div>
              </div>
            </StoreCard>
          ))}
        </div>

        <div>
          <OrderSummary
            action={
              <Button className="mt-2 w-full bg-violet-600 hover:bg-violet-700" size="lg" asChild>
                <Link href={checkoutHref}>Continuar al envío</Link>
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
