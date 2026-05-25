'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function AdminOrdersPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminOrders(1),
    queryFn: () => adminApi.listOrders(1, 20),
  });

  const ready = useMutation({
    mutationFn: (id: string) => adminApi.orderReady(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminOrders(1) });
      toast.success('Pedido listo para despacho');
    },
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Pedidos</h1>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-zinc-400">
            <th className="p-2">Número</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Total</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map((o) => (
            <tr key={o.id} className="border-b border-white/5">
              <td className="p-2">
                <a href={`/admin/orders/${o.id}`} className="text-violet-400 hover:underline">{o.orderNumber}</a>
              </td>
              <td className="p-2">{o.status}</td>
              <td className="p-2">{formatMoney(o.total)}</td>
              <td className="p-2">
                {o.status === 'Paid' && (
                  <Button size="sm" onClick={() => ready.mutate(o.id)}>Listo despacho</Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
