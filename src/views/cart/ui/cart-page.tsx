'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/entities/cart/api/cart-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { Button } from '@/shared/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export function CartPage() {
  const qc = useQueryClient();
  const { data: cart, isLoading } = useQuery({ queryKey: queryKeys.cart, queryFn: cartApi.get });

  const remove = useMutation({
    mutationFn: (id: string) => cartApi.removeItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart }),
  });

  if (isLoading) return <p>Cargando carrito…</p>;
  if (!cart?.items.length)
    return (
      <div className="text-center">
        <p className="text-zinc-400">Tu carrito está vacío</p>
        <Button className="mt-4" asChild><Link href="/">Seguir comprando</Link></Button>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Carrito</h1>
      <ul className="space-y-4">
        {cart.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-lg border border-white/10 p-4">
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-zinc-400">{item.sku} × {item.quantity}</p>
            </div>
            <div className="flex items-center gap-4">
              <span>{formatMoney(item.lineTotal)}</span>
              <Button variant="ghost" size="sm" onClick={() => remove.mutate(item.id)}>Quitar</Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-lg font-semibold">Subtotal</span>
        <span className="text-lg text-violet-400">{formatMoney(cart.subtotal)}</span>
      </div>
      <Button className="w-full" asChild>
        <Link href="/checkout/shipping">Continuar al checkout</Link>
      </Button>
    </div>
  );
}
