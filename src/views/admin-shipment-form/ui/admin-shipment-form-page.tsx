'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

export function AdminShipmentFormPage() {
  const router = useRouter();
  const { data: drivers } = useQuery({ queryKey: queryKeys.adminDrivers, queryFn: adminApi.listDrivers });
  const form = useForm({
    defaultValues: { orderId: '', driverId: drivers?.[0]?.id ?? '', trackingNumber: '' },
  });

  const save = useMutation({
    mutationFn: (body: { orderId: string; driverId: string; trackingNumber?: string }) =>
      adminApi.createShipment(body),
    onSuccess: () => { toast.success('Envío creado'); router.push('/admin/shipments'); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title="Nuevo envío" />
      <form onSubmit={form.handleSubmit((d) => save.mutate(d))} className="max-w-md space-y-4">
        <div><Label>ID pedido (GUID)</Label><Input {...form.register('orderId')} /></div>
        <div>
          <Label>Repartidor</Label>
          <select className="w-full rounded border border-white/10 bg-zinc-900 p-2" {...form.register('driverId')}>
            {drivers?.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
        <div><Label>Tracking</Label><Input {...form.register('trackingNumber')} /></div>
        <Button type="submit">Crear envío</Button>
      </form>
    </div>
  );
}
