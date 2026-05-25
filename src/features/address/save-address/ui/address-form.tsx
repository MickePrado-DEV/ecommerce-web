'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { addressApi } from '@/entities/address/api/address-api';
import { ADDRESS_TYPES } from '@/entities/address/model/types';
import { MEXICAN_STATES } from '@/shared/config/mexican-states';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

const schema = z.object({
  type: z.number().refine((v) => [1, 2, 3, 4].includes(v)),
  label: z.string().min(1).max(60),
  contactName: z.string().min(1).max(120),
  street: z.string().min(1).max(255),
  externalNumber: z.string().min(1).max(20),
  internalNumber: z.string().max(20).optional(),
  neighborhood: z.string().min(1).max(120),
  municipality: z.string().min(1).max(120),
  city: z.string().max(120).optional(),
  state: z.string().min(1).max(120),
  postalCode: z.string().regex(/^\d{5}$/, 'C.P. de 5 dígitos'),
  country: z.string().length(2),
  phone: z.string().min(1).max(20),
  references: z.string().max(500).optional(),
  deliveryInstructions: z.string().max(500).optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof schema>;

const defaults: AddressFormValues = {
  type: 1,
  label: '',
  contactName: '',
  street: '',
  externalNumber: '',
  internalNumber: '',
  neighborhood: '',
  municipality: '',
  city: '',
  state: MEXICAN_STATES[6],
  postalCode: '',
  country: 'MX',
  phone: '',
  references: '',
  deliveryInstructions: '',
  latitude: '',
  longitude: '',
  isDefault: false,
};

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
          type: data.type,
          label: data.label,
          contactName: data.contactName ?? data.label,
          street: data.street,
          externalNumber: data.externalNumber ?? '',
          internalNumber: data.internalNumber ?? '',
          neighborhood: data.neighborhood ?? '',
          municipality: data.municipality ?? data.city,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          phone: data.phone ?? '',
          references: data.references ?? '',
          deliveryInstructions: data.deliveryInstructions ?? '',
          latitude: data.latitude?.toString() ?? '',
          longitude: data.longitude?.toString() ?? '',
          isDefault: data.isDefault,
        }
      : defaults,
  });

  const submit = form.handleSubmit(async (values) => {
    const lat = values.latitude ? Number(values.latitude) : undefined;
    const lng = values.longitude ? Number(values.longitude) : undefined;
    const body = {
      type: values.type,
      label: values.label,
      contactName: values.contactName,
      street: values.street,
      externalNumber: values.externalNumber,
      internalNumber: values.internalNumber || undefined,
      neighborhood: values.neighborhood,
      municipality: values.municipality,
      city: values.city || values.municipality,
      state: values.state,
      postalCode: values.postalCode,
      country: values.country,
      phone: values.phone,
      references: values.references || undefined,
      deliveryInstructions: values.deliveryInstructions || undefined,
      latitude: Number.isFinite(lat) ? lat : undefined,
      longitude: Number.isFinite(lng) ? lng : undefined,
      isDefault: values.isDefault ?? false,
    };
    const saved = isEdit
      ? await addressApi.update(addressId!, body)
      : await addressApi.create(body);
    onSaved(saved.id);
  });

  return (
    <form onSubmit={submit} className="space-y-4 rounded-lg border border-white/10 p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Tipo</Label>
          <select className="mt-1 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm" {...form.register('type')}>
            {ADDRESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Etiqueta</Label>
          <Input {...form.register('label')} placeholder="Casa" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Nombre contacto</Label>
          <Input {...form.register('contactName')} />
        </div>
        <div>
          <Label>Teléfono</Label>
          <Input {...form.register('phone')} />
        </div>
      </div>
      <div>
        <Label>Calle</Label>
        <Input {...form.register('street')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Núm. exterior</Label>
          <Input {...form.register('externalNumber')} />
        </div>
        <div>
          <Label>Núm. interior</Label>
          <Input {...form.register('internalNumber')} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Colonia</Label>
          <Input {...form.register('neighborhood')} />
        </div>
        <div>
          <Label>Municipio</Label>
          <Input {...form.register('municipality')} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <Label>Ciudad (opcional)</Label>
          <Input {...form.register('city')} />
        </div>
        <div>
          <Label>Estado</Label>
          <select className="mt-1 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm" {...form.register('state')}>
            {MEXICAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>C.P.</Label>
          <Input {...form.register('postalCode')} maxLength={5} />
        </div>
      </div>
      <div>
        <Label>Referencias</Label>
        <Input {...form.register('references')} />
      </div>
      <div>
        <Label>Instrucciones de entrega</Label>
        <Input {...form.register('deliveryInstructions')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label>Latitud (opcional)</Label>
          <Input {...form.register('latitude')} placeholder="19.4326" />
        </div>
        <div>
          <Label>Longitud (opcional)</Label>
          <Input {...form.register('longitude')} placeholder="-99.1332" />
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
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        )}
      </div>
    </form>
  );
}
