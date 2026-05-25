'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/entities/cart/api/cart-api';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { queryKeys } from '@/shared/lib/query-keys';
import { authApi } from '@/entities/user/api/auth-api';
import { Button } from '@/shared/ui/button';
import { ShoppingCart, User } from 'lucide-react';

export function StoreHeader() {
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const { data: cart } = useQuery({ queryKey: queryKeys.cart, queryFn: cartApi.get });
  const count = cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0;

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      useAuthStore.getState().clear();
      window.location.href = '/';
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="text-xl font-bold text-violet-400">Ecommerce</Link>
        <nav className="hidden gap-6 md:flex">
          <Link href="/" className="text-sm hover:text-violet-400">Inicio</Link>
          <Link href="/search" className="text-sm hover:text-violet-400">Buscar</Link>
          {user && <Link href="/orders" className="text-sm hover:text-violet-400">Pedidos</Link>}
          {user && <Link href="/wishlist" className="text-sm hover:text-violet-400">Favoritos</Link>}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/cart" className="relative rounded-md p-2 hover:bg-white/10">
            <ShoppingCart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-xs">
                {count}
              </span>
            )}
          </Link>
          {user ? (
            <>
              <Link href="/account" className="rounded-md p-2 hover:bg-white/10" title="Cuenta">
                <User className="h-5 w-5" />
              </Link>
              {hasPermission('admin.dashboard.view') && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/dashboard">Admin</Link>
                </Button>
              )}
              {user.roles.includes('driver') && (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/driver/shipments">Repartidor</Link>
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={logout}>Salir</Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
