'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { adminNavItems } from '@/widgets/admin-sidebar/model/nav-config';
import { cn } from '@/shared/lib/utils';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <aside className="w-60 shrink-0 border-r border-white/10 bg-zinc-900 p-4">
        <p className="mb-6 text-lg font-bold text-violet-400">Admin</p>
        <nav className="flex flex-col gap-1">
          {adminNavItems
            .filter((item) => hasPermission(item.permission))
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded px-3 py-2 text-sm transition',
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-violet-600/30 text-violet-200'
                    : 'hover:bg-white/10',
                )}
              >
                {item.label}
              </Link>
            ))}
        </nav>
        <Link href="/" className="mt-8 block text-sm text-zinc-500 hover:text-zinc-300">
          ← Volver a tienda
        </Link>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
