'use client';

import Link from 'next/link';
import type { FamilyDto } from '@/entities/catalog/model/types';
import { useAuthStore } from '@/entities/user/model/auth-store';

export function SidebarNav({
  families,
  activeFamilyId,
  onFamilyHover,
  onNavigate,
}: {
  families: FamilyDto[];
  activeFamilyId: string | null;
  onFamilyHover: (familyId: string) => void;
  onNavigate: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  const linkClass =
    'block rounded-md px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white';
  const activeFamilyClass =
    'block rounded-md px-3 py-2 text-white bg-gray-800';

  return (
    <nav className="flex h-full flex-col text-sm">
      <div className="border-b border-gray-800 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Mi cuenta</p>
        <ul className="mt-2 space-y-0.5">
          <li>
            <Link href="/" className={linkClass} onClick={onNavigate}>
              Inicio
            </Link>
          </li>
          {user && (
            <li>
              <Link href="/orders" className={linkClass} onClick={onNavigate}>
                Mis pedidos
              </Link>
            </li>
          )}
          {user && hasPermission('admin.dashboard.view') && (
            <li>
              <Link href="/admin/dashboard" className={linkClass} onClick={onNavigate}>
                Administración
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Catálogo</p>
        <ul className="mt-2 space-y-0.5">
          {families.map((f) => (
            <li
              key={f.id}
              onMouseEnter={() => onFamilyHover(f.id)}
            >
              <Link
                href={`/families/${f.slug}`}
                className={activeFamilyId === f.id ? activeFamilyClass : linkClass}
                onClick={() => {
                  onFamilyHover(f.id);
                  onNavigate();
                }}
              >
                {f.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
