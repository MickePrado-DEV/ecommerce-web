import type { DashboardStatsDto } from '@/entities/admin/api/admin-api';

export function AdminStatsCards({ data }: { data?: DashboardStatsDto }) {
  const cards = [
    { label: 'Pedidos', value: data?.totalOrders },
    { label: 'Pendientes pago', value: data?.pendingPaymentOrders },
    { label: 'Pagados', value: data?.paidOrders },
    { label: 'Listos despacho', value: data?.readyToDispatchOrders },
    { label: 'Productos', value: data?.totalProducts },
    { label: 'Usuarios', value: data?.totalUsers },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-zinc-400">{c.label}</p>
          <p className="mt-2 text-3xl font-bold">{c.value ?? 0}</p>
        </div>
      ))}
    </div>
  );
}
