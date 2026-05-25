'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';

export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: adminApi.dashboard,
  });

  if (isLoading) return <p>Cargando…</p>;

  const cards = [
    { label: 'Pedidos', value: data?.totalOrders },
    { label: 'Pendientes pago', value: data?.pendingPaymentOrders },
    { label: 'Pagados', value: data?.paidOrders },
    { label: 'Listos despacho', value: data?.readyToDispatchOrders },
    { label: 'Productos', value: data?.totalProducts },
    { label: 'Usuarios', value: data?.totalUsers },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-zinc-400">{c.label}</p>
            <p className="mt-2 text-3xl font-bold">{c.value ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
