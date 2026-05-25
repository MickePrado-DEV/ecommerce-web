'use client';

import { useEffect, useState } from 'react';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addressApi } from '@/entities/address/api/address-api';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { ADDRESS_TYPES } from '@/entities/address/model/types';
import { MEXICAN_STATES } from '@/shared/config/mexican-states';
import { lookupMexicoPostalCode } from '@/shared/lib/mexico-postal-lookup';
import { roundGeoCoord } from '@/shared/lib/geo-coordinates';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { SelectOrCustomField } from '@/shared/ui/select-or-custom-field';
import { LeafletMapPicker } from '@/widgets/leaflet-map/ui/leaflet-map-picker';
import { toast } from 'sonner';
import { ApiError } from '@/shared/api/client';
import { parseApiFieldErrors } from '@/shared/api/parse-api-error';

const schema = z.object({
  type: z.number().refine((v) => [1, 2, 3, 4].includes(v)),
  label: z.string().min(1, 'Requerido').max(60),
  contactName: z.string().min(1, 'Requerido').max(120),
  street: z.string().min(1, 'Requerido').max(255),
  externalNumber: z.string().min(1, 'Requerido').max(20),
  internalNumber: z.string().max(20).optional(),
  neighborhood: z.string().min(1, 'Requerido').max(120),
  municipality: z.string().min(1, 'Requerido').max(120),
  city: z.string().max(120).optional(),
  state: z.string().min(1, 'Requerido').max(120),
  postalCode: z.string().regex(/^\d{5}$/, 'C.P. de 5 dígitos'),
  country: z.string().length(2),
  phone: z.string().min(1, 'Requerido').max(30, 'Máximo 30 caracteres'),
  references: z.string().max(500).optional(),
  deliveryInstructions: z.string().max(500).optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof schema>;

export function AddressForm({
  addressId,
  onSaved,
  onCancel,
  scrollable = false,
}: {
  addressId?: string;
  onSaved: (id: string) => void;
  onCancel?: () => void;
  /** Solo el cuerpo del formulario hace scroll (cabecera/botones fijos en la página). */
  scrollable?: boolean;
}) {
  const user = useAuthStore((s) => s.user);
  const isEdit = Boolean(addressId);
  const [cpOptions, setCpOptions] = useState<{
    municipalities: string[];
    neighborhoods: string[];
    cities: string[];
  }>({ municipalities: [], neighborhoods: [], cities: [] });
  const [cpLoading, setCpLoading] = useState(false);

  const { data, isLoading: loadingAddress } = useQuery({
    queryKey: ['address', addressId],
    queryFn: () => addressApi.get(addressId!),
    enabled: isEdit,
  });

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 1,
      label: '',
      contactName: user ? `${user.firstName} ${user.lastName}`.trim() : '',
      street: '',
      externalNumber: '',
      internalNumber: '',
      neighborhood: '',
      municipality: '',
      city: '',
      state: MEXICAN_STATES[6],
      postalCode: '',
      country: 'MX',
      phone: user?.phone ?? '',
      references: '',
      deliveryInstructions: '',
      latitude: '',
      longitude: '',
      isDefault: false,
    },
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
      : undefined,
  });

  const postalCode = useWatch({ control: form.control, name: 'postalCode' });

  useEffect(() => {
    const cp = postalCode?.replace(/\D/g, '') ?? '';
    if (cp.length !== 5) return;

    let cancelled = false;
    setCpLoading(true);
    lookupMexicoPostalCode(cp).then((result) => {
      if (cancelled || !result) {
        setCpLoading(false);
        return;
      }
      setCpOptions({
        municipalities: result.municipalities,
        neighborhoods: result.neighborhoods,
        cities: result.city ? [result.city, ...result.municipalities] : result.municipalities,
      });
      if (result.state) form.setValue('state', result.state, { shouldValidate: true });
      if (result.municipalities.length === 1) {
        form.setValue('municipality', result.municipalities[0], { shouldValidate: true });
      }
      if (result.neighborhoods.length === 1) {
        form.setValue('neighborhood', result.neighborhoods[0], { shouldValidate: true });
      }
      if (result.city) form.setValue('city', result.city);
      setCpLoading(false);
      toast.success('Datos del C.P. aplicados');
    });

    return () => {
      cancelled = true;
    };
  }, [postalCode, form]);

  const saveMutation = useMutation({
    mutationFn: async (values: AddressFormValues) => {
      const latRaw = values.latitude ? Number(values.latitude) : undefined;
      const lngRaw = values.longitude ? Number(values.longitude) : undefined;
      const lat = Number.isFinite(latRaw) ? roundGeoCoord(latRaw!) : undefined;
      const lng = Number.isFinite(lngRaw) ? roundGeoCoord(lngRaw!) : undefined;
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
        latitude: lat,
        longitude: lng,
        isDefault: values.isDefault ?? false,
      };
      return isEdit
        ? addressApi.update(addressId!, body)
        : addressApi.create(body);
    },
    onSuccess: (saved) => {
      toast.success(isEdit ? 'Dirección actualizada' : 'Dirección guardada');
      onSaved(saved.id);
    },
    onError: (e: Error) => {
      if (e instanceof ApiError && e.status === 401 && typeof window !== 'undefined') {
        toast.error(e.message);
        window.location.href = '/login?reason=session';
        return;
      }
      if (e instanceof ApiError && e.body) {
        const fields = parseApiFieldErrors(e.body);
        for (const [key, message] of Object.entries(fields)) {
          const field = key as keyof AddressFormValues;
          if (field in form.getValues()) form.setError(field, { type: 'server', message });
        }
      }
      toast.error(e.message || 'No se pudo guardar la dirección');
    },
  });

  const latStr = useWatch({ control: form.control, name: 'latitude' });
  const lngStr = useWatch({ control: form.control, name: 'longitude' });
  const latNum = latStr ? Number(latStr) : null;
  const lngNum = lngStr ? Number(lngStr) : null;

  const selectClass =
    'mt-1 h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white';
  const fieldCell = 'min-w-0 space-y-1';

  const formFields = (
    <div className="grid gap-4 md:grid-cols-2">
      <div className={fieldCell}>
        <Label>Tipo</Label>
        <select className={selectClass} {...form.register('type', { valueAsNumber: true })}>
          {ADDRESS_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>
      <div className={fieldCell}>
        <Label>Etiqueta</Label>
        <Input {...form.register('label')} placeholder="Casa" className="h-10 border-slate-700 bg-slate-900" />
        {form.formState.errors.label && (
          <p className="text-xs text-red-400">{form.formState.errors.label.message}</p>
        )}
      </div>

      <div className={fieldCell}>
        <Label>Nombre contacto</Label>
        <Input {...form.register('contactName')} className="h-10 border-slate-700 bg-slate-900" />
        {form.formState.errors.contactName && (
          <p className="text-xs text-red-400">{form.formState.errors.contactName.message}</p>
        )}
      </div>
      <div className={fieldCell}>
        <Label>Teléfono</Label>
        <Input {...form.register('phone')} className="h-10 border-slate-700 bg-slate-900" />
        {form.formState.errors.phone && (
          <p className="text-xs text-red-400">{form.formState.errors.phone.message}</p>
        )}
      </div>

      <div className={fieldCell}>
        <Label>Código postal</Label>
        <Input
          {...form.register('postalCode')}
          maxLength={5}
          inputMode="numeric"
          placeholder="00000"
          className="h-10 border-slate-700 bg-slate-900"
        />
        {cpLoading && <p className="text-xs text-slate-500">Buscando colonia y municipio…</p>}
        {form.formState.errors.postalCode && (
          <p className="text-xs text-red-400">{form.formState.errors.postalCode.message}</p>
        )}
      </div>
      <div className={fieldCell}>
        <Label>Estado</Label>
        <select className={selectClass} {...form.register('state')}>
          <option value="">Selecciona estado</option>
          {MEXICAN_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {form.formState.errors.state && (
          <p className="text-xs text-red-400">{form.formState.errors.state.message}</p>
        )}
      </div>

      <Controller
        control={form.control}
        name="municipality"
        render={({ field }) => (
          <SelectOrCustomField
            className={fieldCell}
            label="Municipio / Alcaldía"
            value={field.value}
            options={cpOptions.municipalities}
            onChange={field.onChange}
            placeholder="Selecciona municipio"
          />
        )}
      />
      {form.formState.errors.municipality && (
        <p className="-mt-2 text-xs text-red-400 md:col-span-2">{form.formState.errors.municipality.message}</p>
      )}

      <Controller
        control={form.control}
        name="neighborhood"
        render={({ field }) => (
          <SelectOrCustomField
            className={fieldCell}
            label="Colonia"
            value={field.value}
            options={cpOptions.neighborhoods}
            onChange={field.onChange}
            placeholder="Selecciona colonia"
          />
        )}
      />
      {form.formState.errors.neighborhood && (
        <p className="-mt-2 text-xs text-red-400 md:col-span-2">{form.formState.errors.neighborhood.message}</p>
      )}

      <Controller
        control={form.control}
        name="city"
        render={({ field }) => (
          <SelectOrCustomField
            className={`${fieldCell} md:col-span-2`}
            label="Ciudad (opcional)"
            value={field.value ?? ''}
            options={cpOptions.cities}
            onChange={field.onChange}
            placeholder="Selecciona ciudad"
          />
        )}
      />

      <div className={`${fieldCell} md:col-span-2`}>
        <Label>Calle</Label>
        <Input {...form.register('street')} className="h-10 border-slate-700 bg-slate-900" />
        {form.formState.errors.street && (
          <p className="text-xs text-red-400">{form.formState.errors.street.message}</p>
        )}
      </div>

      <div className={fieldCell}>
        <Label>Núm. exterior</Label>
        <Input {...form.register('externalNumber')} className="h-10 border-slate-700 bg-slate-900" />
        {form.formState.errors.externalNumber && (
          <p className="text-xs text-red-400">{form.formState.errors.externalNumber.message}</p>
        )}
      </div>
      <div className={fieldCell}>
        <Label>Núm. interior</Label>
        <Input {...form.register('internalNumber')} className="h-10 border-slate-700 bg-slate-900" />
      </div>

      <div className={fieldCell}>
        <Label>Referencias</Label>
        <Input {...form.register('references')} className="h-10 border-slate-700 bg-slate-900" />
      </div>
      <div className={fieldCell}>
        <Label>Instrucciones de entrega</Label>
        <Input {...form.register('deliveryInstructions')} className="h-10 border-slate-700 bg-slate-900" />
      </div>
    </div>
  );

  const mapSection = (
    <div className="border-t border-slate-700/50 pt-4 md:col-span-2">
      <Label className="mb-2 block">Ubicación en mapa</Label>
      <LeafletMapPicker
        latitude={Number.isFinite(latNum) ? latNum : null}
        longitude={Number.isFinite(lngNum) ? lngNum : null}
          onChange={(lat, lng) => {
            form.setValue('latitude', String(roundGeoCoord(lat)));
            form.setValue('longitude', String(roundGeoCoord(lng)));
          }}
        heightClass="h-52 md:h-56"
      />
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        <div>
          <Label>Latitud</Label>
          <Input {...form.register('latitude')} readOnly className="border-slate-700 bg-slate-900/80" />
        </div>
        <div>
          <Label>Longitud</Label>
          <Input {...form.register('longitude')} readOnly className="border-slate-700 bg-slate-900/80" />
        </div>
      </div>
    </div>
  );

  const formFooter = (
    <>
      <input type="hidden" {...form.register('country')} />
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" {...form.register('isDefault')} className="rounded" />
        Usar como dirección predeterminada
      </label>
    </>
  );

  if (loadingAddress && isEdit) {
    return <p className="text-sm text-slate-500">Cargando dirección…</p>;
  }

  if (scrollable) {
    return (
      <form
        onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))}
        className="flex h-full min-h-0 w-full flex-1 flex-col"
      >
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth pr-2 [-webkit-overflow-scrolling:touch]">
          <div className="space-y-6 pb-4">
            {formFields}
            {mapSection}
            {formFooter}
          </div>
        </div>
        <div className="shrink-0 flex flex-wrap gap-2 border-t border-slate-700/50 bg-slate-900/95 pt-4">
          <Button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Guardar dirección'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={form.handleSubmit((v) => saveMutation.mutate(v))} className="space-y-4">
      {formFields}
      {mapSection}
      {formFooter}
      <div className="flex gap-2 pt-2">
        <Button type="submit" className="bg-violet-600 hover:bg-violet-700" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Guardar dirección'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
