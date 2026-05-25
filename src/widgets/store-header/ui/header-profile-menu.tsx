'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { authApi } from '@/entities/user/api/auth-api';
import { cn } from '@/shared/lib/utils';

function userInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function HeaderProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);

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
          className="absolute right-0 top-full z-[60] mt-2 min-w-[200px] overflow-hidden rounded-lg border border-gray-700 bg-gray-900 py-1 shadow-xl"
          role="menu"
        >
          <Link
            href="/orders"
            className="block px-4 py-2.5 text-sm text-white hover:bg-gray-800"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Mis pedidos
          </Link>
          <Link
            href="/account"
            className="block px-4 py-2.5 text-sm text-white hover:bg-gray-800"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            Mi Perfil
          </Link>
          {hasPermission('admin.dashboard.view') && (
            <Link
              href="/admin/dashboard"
              className="block px-4 py-2.5 text-sm text-white hover:bg-gray-800"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Administración
            </Link>
          )}
          {user.roles.includes('driver') && (
            <Link
              href="/driver/shipments"
              className="block px-4 py-2.5 text-sm text-white hover:bg-gray-800"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              Repartidor
            </Link>
          )}
          <div className="my-1 border-t border-gray-700" />
          <button
            type="button"
            className={cn(
              'block w-full px-4 py-2.5 text-left text-sm text-white hover:bg-gray-800',
            )}
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
