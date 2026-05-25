'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function AdminUsersPage() {
  const [page] = useState(1);
  const [search, setSearch] = useState('');
  const [term, setTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminUsers(page, search),
    queryFn: () => adminApi.listUsers(page, 20, search || undefined),
  });

  return (
    <div>
      <PageHeader title="Usuarios" />
      <form
        className="mb-6 flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(term);
        }}
      >
        <Input
          placeholder="Buscar por email o nombre…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit" variant="outline">
          Buscar
        </Button>
      </form>
      {isLoading && <p>Cargando…</p>}
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-zinc-400">
            <th className="p-2">Email</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Roles</th>
            <th className="p-2">Estado</th>
            <th className="p-2" />
          </tr>
        </thead>
        <tbody>
          {data?.items.map((u) => (
            <tr key={u.id} className="border-b border-white/5">
              <td className="p-2">{u.email}</td>
              <td className="p-2">
                {u.firstName} {u.lastName}
              </td>
              <td className="p-2 text-zinc-400">{u.roles.join(', ')}</td>
              <td className="p-2">{u.isActive ? 'Activo' : 'Inactivo'}</td>
              <td className="p-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/users/${u.id}/edit`}>Editar</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!isLoading && !data?.items.length && (
        <p className="mt-4 text-zinc-500">No hay usuarios.</p>
      )}
    </div>
  );
}
