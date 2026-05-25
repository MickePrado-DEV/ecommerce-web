'use client';

import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/entities/cart/api/cart-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';

export function CartSummary({ showCheckoutLink = true }: { showCheckoutLink?: boolean }) {
  const { data: cart, isLoading } = useQuery({ queryKey: queryKeys.cart, queryFn: cartApi.get });

  if (isLoading) return <p className="text-sm text-zinc-500">Cargando…</p>;
  if (!cart?.items.length) return <p className="text-sm text-zinc-500">Carrito vacío</p>;

  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-6">
      <h3 className="mb-4 font-semibold">Resumen</h3>
      <ul className="mb-4 space-y-2 text-sm">
        {cart.items.map((i) => (
          <li key={i.id} className="flex justify-between gap-2">
            <span className="truncate">
              {i.productName} × {i.quantity}
            </span>
            <span>{formatMoney(i.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between border-t border-white/10 pt-4 font-semibold">
        <span>Subtotal</span>
        <span className="text-violet-400">{formatMoney(cart.subtotal)}</span>
      </div>
      {showCheckoutLink && (
        <Button className="mt-4 w-full" asChild>
          <Link href="/checkout/shipping">Continuar al checkout</Link>
        </Button>
      )}
    </div>
  );
}
