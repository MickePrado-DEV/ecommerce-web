'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { addressApi } from '@/entities/address/api/address-api';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

export function AccountAddressFormPage() {
  const id = useParams().id as string | undefined;
  const router = useRouter();
  const isEdit = Boolean(id) && id !== 'new';

  const { data } = useQuery({
    queryKey: ['address', id],
    queryFn: () => addressApi.get(id!),
    enabled: !!isEdit,
  });

  const form = useForm({
    values: data
      ? {
          label: data.label,
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          phone: data.phone ?? '',
        }
      : {
          label: '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'MX',
          phone: '',
        },
  });

  const save = useMutation({
    mutationFn: async (body: Parameters<typeof addressApi.create>[0]) => {
      if (isEdit) return addressApi.update(id!, body);
      return addressApi.create(body);
    },
    onSuccess: () => {
      toast.success('Dirección guardada');
      router.push('/account/addresses');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title={isEdit ? 'Editar dirección' : 'Nueva dirección'} />
      <form
        onSubmit={form.handleSubmit((d) => save.mutate(d))}
        className="space-y-4 rounded-lg border border-white/10 p-6"
      >
        <div><Label>Etiqueta</Label><Input {...form.register('label')} /></div>
        <div><Label>Calle</Label><Input {...form.register('street')} /></div>
        <div><Label>Ciudad</Label><Input {...form.register('city')} /></div>
        <div><Label>Estado</Label><Input {...form.register('state')} /></div>
        <div><Label>C.P.</Label><Input {...form.register('postalCode')} /></div>
        <div><Label>País</Label><Input {...form.register('country')} /></div>
        <div><Label>Teléfono</Label><Input {...form.register('phone')} /></div>
        <Button type="submit">Guardar</Button>
      </form>
    </div>
  );
}
