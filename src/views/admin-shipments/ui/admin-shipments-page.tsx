'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';

export function AdminShipmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminShipments,
    queryFn: () => adminApi.listShipments(1, 50),
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader title="Envíos" action={<Button asChild><Link href="/admin/shipments/new">Nuevo envío</Link></Button>} />
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-zinc-400">
            <th className="p-2">Pedido</th><th className="p-2">Estado</th><th className="p-2">Tracking</th><th className="p-2">Repartidor</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((s) => (
            <tr key={s.id} className="border-b border-white/5">
              <td className="p-2">{s.orderId.slice(0, 8)}…</td>
              <td className="p-2">{s.status}</td>
              <td className="p-2">{s.trackingNumber ?? '—'}</td>
              <td className="p-2">{s.driverName ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
