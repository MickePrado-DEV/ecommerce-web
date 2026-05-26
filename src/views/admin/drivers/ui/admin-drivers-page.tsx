'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import type { DriverAdminDto } from '@/entities/admin/model/types';

function formatVehicle(d: DriverAdminDto) {
  const parts = [d.vehicleType, d.vehiclePlate].filter(Boolean);
  return parts.length ? parts.join(' · ') : '—';
}

export function AdminDriversPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.adminDrivers, queryFn: adminApi.listDrivers });
  const del = useMutation({
    mutationFn: adminApi.deleteDriver,
    onSuccess: () => { qc.invalidateQueries({ queryKey: queryKeys.adminDrivers }); toast.success('Eliminado'); },
  });

  if (isLoading) return <p className="text-slate-400">Cargando…</p>;

  return (
    <div>
      <div className="sticky top-0 z-30 -mx-6 border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <Link href="/admin/dashboard" className="transition hover:text-slate-200">
            Dashboard
          </Link>
          <span className="mx-2 text-slate-600">/</span>
          <span className="text-slate-200">Conductores</span>
        </nav>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">Conductores</h1>
        <Button
          asChild
          className="rounded-md bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          <Link href="/admin/drivers/new">+ Nuevo conductor</Link>
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-slate-900/40">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-[11px] font-medium uppercase tracking-wider text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left">NOMBRE</th>
              <th className="px-4 py-3 text-left">TELÉFONO</th>
              <th className="px-4 py-3 text-left">VEHICULO</th>
              <th className="px-4 py-3 text-left">ESTADO</th>
              <th className="px-4 py-3 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((d) => (
              <tr key={d.id} className="border-t border-white/10 transition hover:bg-white/5">
                <td className="px-4 py-3 text-slate-100">{d.name}</td>
                <td className="px-4 py-3 text-slate-300">{d.phone}</td>
                <td className="px-4 py-3 text-slate-300">{formatVehicle(d)}</td>
                <td className="px-4 py-3">
                  {d.isActive ? (
                    <span className="font-medium text-emerald-400">Activo</span>
                  ) : (
                    <span className="text-slate-400">Inactivo</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 rounded-md p-2 text-sky-400 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-400/40"
                      asChild
                    >
                      <Link href={`/admin/drivers/${d.id}/edit`} aria-label="Editar">
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-9 w-9 rounded-md p-2 text-red-400 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-blue-400/40"
                      aria-label="Eliminar"
                      onClick={() => del.mutate(d.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
