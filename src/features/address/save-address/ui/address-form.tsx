'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { addressApi } from '@/entities/address/api/address-api';
import { MEXICAN_STATES } from '@/shared/config/mexican-states';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

const schema = z.object({
  label: z.string().min(1, 'Etiqueta requerida'),
  street: z.string().min(1, 'Calle requerida'),
  city: z.string().min(1, 'Ciudad requerida'),
  state: z.string().min(1, 'Estado requerido'),
  postalCode: z.string().regex(/^\d{5}$/, 'C.P. de 5 dígitos'),
  country: z.string().length(2, 'País de 2 letras'),
  phone: z.string().min(1, 'Teléfono requerido'),
  isDefault: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof schema>;

export function AddressForm({
  addressId,
  onSaved,
  onCancel,
}: {
  addressId?: string;
  onSaved: (id: string) => void;
  onCancel?: () => void;
}) {
  const isEdit = Boolean(addressId);

  const { data } = useQuery({
    queryKey: ['address', addressId],
    queryFn: () => addressApi.get(addressId!),
    enabled: isEdit,
  });

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(schema),
    values: data
      ? {
          label: data.label,
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          phone: data.phone ?? '',
          isDefault: data.isDefault,
        }
      : {
          label: '',
          street: '',
          city: '',
          state: MEXICAN_STATES[0],
          postalCode: '',
          country: 'MX',
          phone: '',
          isDefault: false,
        },
  });

  const submit = form.handleSubmit(async (values) => {
    const body = {
      label: values.label,
      street: values.street,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
      phone: values.phone,
      isDefault: values.isDefault ?? false,
    };
    const saved = isEdit
      ? await addressApi.update(addressId!, body)
      : await addressApi.create(body);
    onSaved(saved.id);
  });

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border border-white/10 p-4">
      <div>
        <Label>Etiqueta (Casa, Oficina…)</Label>
        <Input {...form.register('label')} placeholder="Casa" />
      </div>
      <div>
        <Label>Calle y número</Label>
        <Input {...form.register('street')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Ciudad</Label>
          <Input {...form.register('city')} />
        </div>
        <div>
          <Label>Estado</Label>
          <select
            className="w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm"
            {...form.register('state')}
          >
            {MEXICAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>C.P.</Label>
          <Input {...form.register('postalCode')} maxLength={5} />
        </div>
        <div>
          <Label>Teléfono</Label>
          <Input {...form.register('phone')} />
        </div>
      </div>
      <input type="hidden" {...form.register('country')} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...form.register('isDefault')} />
        Dirección predeterminada
      </label>
      <div className="flex gap-2">
        <Button type="submit">{isEdit ? 'Guardar cambios' : 'Guardar dirección'}</Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
