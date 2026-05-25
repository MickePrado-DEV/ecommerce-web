'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { addressApi } from '@/entities/address/api/address-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { authApi } from '@/entities/user/api/auth-api';
import { cn } from '@/shared/lib/utils';
import { MapPin, ChevronRight } from 'lucide-react';
import { MAX_USER_ADDRESSES, canAddMoreAddresses } from '@/entities/address/model/constants';

function userInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function HeaderProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const { data: addresses, isLoading: loadingAddresses } = useQuery({
    queryKey: queryKeys.addresses,
    queryFn: addressApi.list,
    enabled: open && !!user,
  });

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  const initials = userInitials(user.firstName, user.lastName);

  const logout = async () => {
    setOpen(false);
    try {
      await authApi.logout();
    } finally {
      useAuthStore.getState().clear();
      window.location.href = '/';
    }
  };

  const menuLink =
    'block px-4 py-2.5 text-sm text-white hover:bg-gray-800';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-purple-600 ring-2 ring-white/30 hover:ring-white/60"
        aria-label="Menú de perfil"
        aria-expanded={open}
      >
        {initials}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-[60] mt-2 w-72 overflow-hidden rounded-lg border border-gray-700 bg-gray-900 shadow-xl"
          role="menu"
        >
          <div className="border-b border-gray-800 px-4 py-3">
            <p className="text-sm font-medium text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-gray-400">{user.email}</p>
          </div>

          <Link href="/orders" className={menuLink} role="menuitem" onClick={() => setOpen(false)}>
            Mis pedidos
          </Link>
          <Link href="/account" className={menuLink} role="menuitem" onClick={() => setOpen(false)}>
            Mi perfil
          </Link>

          <div className="border-t border-gray-800">
            <Link
              href="/account/addresses"
              className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-violet-300 hover:bg-gray-800"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Mis direcciones
              </span>
              <ChevronRight className="h-4 w-4" />
            </Link>
            <div className="max-h-48 overflow-y-auto overscroll-contain border-t border-gray-800/80 bg-gray-950/50">
              {loadingAddresses && (
                <p className="px-4 py-3 text-xs text-gray-500">Cargando direcciones…</p>
              )}
              {!loadingAddresses && !addresses?.length && (
                <p className="px-4 py-3 text-xs text-gray-500">
                  Sin direcciones.{' '}
                  <Link
                    href="/account/addresses/new"
                    className="text-violet-400 hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    Agregar una
                  </Link>
                </p>
              )}
              {!loadingAddresses && addresses && addresses.length > 0 && (
                <p className="px-4 py-2 text-[10px] text-gray-500">
                  {addresses.length} de {MAX_USER_ADDRESSES}
                </p>
              )}
              {addresses?.slice(0, MAX_USER_ADDRESSES).map((a) => (
                <Link
                  key={a.id}
                  href={`/account/addresses/${a.id}/edit`}
                  className="block border-b border-gray-800/60 px-4 py-2.5 last:border-0 hover:bg-gray-800"
                  onClick={() => setOpen(false)}
                >
                  <p className="text-sm text-white">
                    {a.label}
                    {a.isDefault && (
                      <span className="ml-1 text-[10px] text-violet-400">· predeterminada</span>
                    )}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {a.street} {a.externalNumber}, {a.neighborhood ?? a.municipality}
                  </p>
                </Link>
              ))}
              {!loadingAddresses && addresses && canAddMoreAddresses(addresses.length) && (
                <Link
                  href="/account/addresses/new"
                  className="block px-4 py-2 text-xs text-violet-400 hover:bg-gray-800 hover:underline"
                  onClick={() => setOpen(false)}
                >
                  + Agregar dirección
                </Link>
              )}
            </div>
          </div>

          {hasPermission('admin.dashboard.view') && (
            <Link
              href="/admin/dashboard"
              className={menuLink}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Administración
            </Link>
          )}
          {user.roles.includes('driver') && (
            <Link
              href="/driver/shipments"
              className={menuLink}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Repartidor
            </Link>
          )}
          <div className="my-1 border-t border-gray-700" />
          <button
            type="button"
            className={cn('block w-full px-4 py-2.5 text-left text-sm text-white hover:bg-gray-800')}
            role="menuitem"
            onClick={logout}
          >
            Finalizar sesión
          </button>
        </div>
      )}
    </div>
  );
}
