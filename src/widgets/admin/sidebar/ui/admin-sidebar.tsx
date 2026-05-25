'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/entities/user/model/auth-store';
import {
  adminNavSections,
  isNavLinkActive,
} from '@/widgets/admin/sidebar/model/nav-config';
import { cn } from '@/shared/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-zinc-900">
      <div className="border-b border-white/10 p-4">
        <Link href="/admin/dashboard" className="text-lg font-bold text-violet-400">
          Admin
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {adminNavSections.map((section, idx) => {
          const visibleLinks = section.links.filter((link) => hasPermission(link.permission));
          if (!visibleLinks.length) return null;

          return (
            <div key={idx} className={section.title ? 'mt-5 first:mt-0' : ''}>
              {section.title && (
                <p className="mb-2 px-3 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
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
                          'group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/5',
                          active && 'bg-white/10 ring-1 ring-white/10',
                        )}
                      >
                        <span
                          className={cn(
                            'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition',
                            active
                              ? 'bg-violet-600/15 text-violet-300'
                              : 'bg-white/5 text-zinc-400 group-hover:text-zinc-200',
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span
                          className={cn(
                            'min-w-0 flex-1 truncate text-sm font-medium',
                            active ? 'text-white' : 'text-zinc-200',
                          )}
                        >
                          {link.label}
                        </span>
                        <ChevronRight
                          className={cn(
                            'h-3.5 w-3.5 text-zinc-500 opacity-0 transition group-hover:opacity-100',
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
      <div className="border-t border-white/10 p-4">
        <Link href="/" className="text-sm text-zinc-500 transition hover:text-zinc-300">
          ← Volver a tienda
        </Link>
      </div>
    </aside>
  );
}
