'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';

export function AdminOrderDetailPage() {
  const id = useParams().id as string;
  const qc = useQueryClient();
  const { data: order, isLoading } = useQuery({
    queryKey: queryKeys.adminOrder(id),
    queryFn: () => adminApi.getOrder(id),
  });

  const ready = useMutation({
    mutationFn: () => adminApi.orderReady(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminOrder(id) });
      toast.success('Listo para despacho');
    },
  });

  if (isLoading || !order) return <p>Cargando…</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Pedido ${order.orderNumber}`}
        action={<Button variant="outline" asChild><Link href="/admin/orders">← Pedidos</Link></Button>}
      />
      <p>Estado: <strong>{order.status}</strong></p>
      <ul className="space-y-2 text-sm">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between">
            <span>{item.productName} × {item.quantity}</span>
            <span>{formatMoney(item.lineTotal)}</span>
          </li>
        ))}
      </ul>
      <p className="text-lg font-bold">{formatMoney(order.total)}</p>
      <div className="flex flex-wrap gap-2">
        {order.status === 'Paid' && (
          <Button onClick={() => ready.mutate()}>Marcar listo despacho</Button>
        )}
        <Button variant="outline" asChild>
          <a href={adminApi.orderTicketUrl(id)} target="_blank" rel="noreferrer">Ticket PDF</a>
        </Button>
      </div>
    </div>
  );
}
