'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { formatMoney } from '@/shared/lib/format-money';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

function AdminShipmentFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedOrderId = searchParams.get('orderId');
  const { data: drivers } = useQuery({ queryKey: queryKeys.adminDrivers, queryFn: adminApi.listDrivers });
  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: queryKeys.adminOrders(1, 'ReadyToDispatch'),
    queryFn: () => adminApi.listOrders(1, 50, 'ReadyToDispatch'),
  });

  const form = useForm({
    defaultValues: { orderId: '', driverId: '', trackingNumber: '' },
  });

  useEffect(() => {
    if (drivers?.[0]?.id && !form.getValues('driverId')) {
      form.setValue('driverId', drivers[0].id);
    }
    if (preselectedOrderId) {
      form.setValue('orderId', preselectedOrderId);
    }
  }, [drivers, form, preselectedOrderId]);

  const save = useMutation({
    mutationFn: (body: { orderId: string; driverId: string; trackingNumber?: string }) =>
      adminApi.createShipment(body),
    onSuccess: () => {
      toast.success('Envío creado');
      router.push('/admin/shipments');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title="Nuevo envío" />
      <form onSubmit={form.handleSubmit((d) => save.mutate(d))} className="max-w-lg space-y-4">
        <div>
          <Label>Pedido listo para despacho</Label>
          {ordersLoading ? (
            <p className="text-sm text-zinc-500">Cargando pedidos…</p>
          ) : (
            <select
              className="w-full rounded border border-white/10 bg-zinc-900 p-2"
              {...form.register('orderId', { required: true })}
            >
              <option value="">Selecciona un pedido</option>
              {orders?.items.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber} — {formatMoney(o.total)} ({o.status})
                </option>
              ))}
            </select>
          )}
          {!ordersLoading && !orders?.items.length && (
            <p className="mt-1 text-xs text-amber-400">
              No hay pedidos en estado ReadyToDispatch. Márcalos como &quot;Listo despacho&quot; primero.
            </p>
          )}
        </div>
        <div>
          <Label>Repartidor</Label>
          <select
            className="w-full rounded border border-white/10 bg-zinc-900 p-2"
            {...form.register('driverId', { required: true })}
          >
            {!drivers?.length && <option value="">Sin repartidores</option>}
            {drivers?.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} · {d.phone}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Tracking (opcional)</Label>
          <Input {...form.register('trackingNumber')} placeholder="Ej. TRK-001" />
        </div>
        <Button type="submit" disabled={!form.watch('orderId') || !form.watch('driverId')}>
          Crear envío
        </Button>
      </form>
    </div>
  );
}

export function AdminShipmentFormPage() {
  return (
    <Suspense>
      <AdminShipmentFormContent />
    </Suspense>
  );
}
