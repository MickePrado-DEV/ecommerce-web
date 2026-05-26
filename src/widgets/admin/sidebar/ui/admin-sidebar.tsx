'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { LogoutButton } from '@/features/auth/logout/ui/logout-button';
import {
  adminNavSections,
  isNavLinkActive,
} from '@/widgets/admin/sidebar/model/nav-config';
import { cn } from '@/shared/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const user = useAuthStore((s) => s.user);

  return (
    <aside className="h-screen w-[260px] shrink-0 border-r border-white/10 bg-slate-950/70 backdrop-blur">
      <div className="flex h-screen flex-col">
        <div className="shrink-0 border-b border-white/10 p-4">
          <Link
            href="/admin/dashboard"
            className="text-lg font-bold text-violet-400 transition hover:text-violet-300"
          >
            Admin
          </Link>
          <p className="mt-1 text-sm text-slate-400">Ecommerce Panel</p>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4 pt-3" aria-label="Admin">
          {adminNavSections.map((section, idx) => {
            const visibleLinks = section.links.filter((link) => hasPermission(link.permission));
            if (!visibleLinks.length) return null;

            return (
              <div key={idx} className={section.title ? 'mt-5 first:mt-0' : ''}>
                {section.title && (
                  <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-widest text-slate-500">
                    {section.title}
                  </p>
                )}
                <ul className="space-y-1">
                  {visibleLinks.map((link) => {
                    const active = isNavLinkActive(pathname, link);
                    const Icon = link.icon;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'group flex items-center gap-3 rounded-lg px-3 py-2.5 transition hover:bg-white/5',
                            active && 'bg-white/10 ring-1 ring-white/10',
                          )}
                        >
                          <span
                            className={cn(
                              'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition',
                              active
                                ? 'bg-violet-600/15 text-violet-300'
                                : 'bg-white/5 text-slate-400 group-hover:text-slate-200',
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span
                            className={cn(
                              'min-w-0 flex-1 truncate text-sm font-medium',
                              active ? 'text-white' : 'text-slate-200',
                            )}
                          >
                            {link.label}
                          </span>
                          <ChevronRight
                            className={cn(
                              'h-3.5 w-3.5 text-slate-500 opacity-0 transition group-hover:opacity-100',
                              active && 'opacity-100 text-violet-400',
                            )}
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 space-y-3 border-t border-white/10 p-3">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-slate-200"
          >
            Volver a la tienda
          </Link>
          {user && (
            <div className="rounded-lg border border-white/10 bg-slate-900/40 px-3 py-2">
              <p className="truncate text-sm font-medium text-slate-200">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-slate-400" title={user.email}>
                {user.email}
              </p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/account"
              className="rounded-md px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Perfil
            </Link>
            <LogoutButton className="rounded-md px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white" />
          </div>
        </div>
      </div>
    </aside>
  );
}
