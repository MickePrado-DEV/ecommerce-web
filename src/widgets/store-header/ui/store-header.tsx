'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { cartApi } from '@/entities/cart/api/cart-api';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { queryKeys } from '@/shared/lib/query-keys';
import { HeaderSearch } from '@/features/catalog/header-search/ui/header-search';
import { StoreDrawer } from '@/widgets/store-drawer/ui/store-drawer';
import { HeaderProfileMenu } from '@/widgets/store-header/ui/header-profile-menu';
import { Button } from '@/shared/ui/button';
import { Menu, ShoppingCart } from 'lucide-react';

export function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const { data: cart } = useQuery({ queryKey: queryKeys.cart, queryFn: cartApi.get });
  const count = cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0;

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-purple-800 bg-purple-700">
        <div className="flex h-16 items-center gap-3 px-4">
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-purple-600 hover:text-white"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="leading-tight text-white">
              <span className="block text-lg font-bold">Ecommerce</span>
              <span className="block text-[10px] font-normal text-purple-200">tienda online</span>
            </Link>
          </div>

          <HeaderSearch />

          <div className="flex shrink-0 items-center gap-2">
            {user ? (
              <HeaderProfileMenu />
            ) : (
              <Button size="sm" className="bg-white text-purple-700 hover:bg-gray-100" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            )}
            <Link
              href="/cart"
              className="relative rounded-md p-2 text-white hover:bg-purple-600"
              aria-label="Carrito"
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-purple-700">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
      <StoreDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
