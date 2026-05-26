'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import type { DriverAdminDto } from '@/entities/admin/model/types';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

const inputClassName =
  'w-full rounded-md border border-white/10 bg-slate-950/40 px-3 py-2 text-sm focus:border-blue-400/40 focus:outline-none focus:ring-2 focus:ring-blue-400/20';

const labelClassName = 'mb-2 block text-sm font-medium text-slate-300';

export interface DriverFormValues {
  name: string;
  phone: string;
  email: string;
  licenseNumber: string;
  vehicleType: string;
  vehiclePlate: string;
  isActive: boolean;
  notes: string;
}

const emptyValues: DriverFormValues = {
  name: '',
  phone: '',
  email: '',
  licenseNumber: '',
  vehicleType: '',
  vehiclePlate: '',
  isActive: true,
  notes: '',
};

function toFormValues(item: {
  name: string;
  phone: string;
  email?: string | null;
  licenseNumber?: string | null;
  vehicleType?: string | null;
  vehiclePlate?: string | null;
  notes?: string | null;
  isActive: boolean;
}): DriverFormValues {
  return {
    name: item.name,
    phone: item.phone,
    email: item.email ?? '',
    licenseNumber: item.licenseNumber ?? '',
    vehicleType: item.vehicleType ?? '',
    vehiclePlate: item.vehiclePlate ?? '',
    isActive: item.isActive,
    notes: item.notes ?? '',
  };
}

function toSaveBody(d: DriverFormValues) {
  return {
    name: d.name.trim(),
    phone: d.phone.trim(),
    email: d.email.trim() || null,
    licenseNumber: d.licenseNumber.trim() || null,
    vehicleType: d.vehicleType.trim() || null,
    vehiclePlate: d.vehiclePlate.trim() || null,
    notes: d.notes.trim() || null,
    isActive: d.isActive,
  };
}

function showGeneratedPasswordToast(password: string) {
  toast.success(`Contraseña temporal generada: ${password}`, {
    description: 'Compártela con el repartidor. Deberá cambiarla al iniciar sesión.',
    duration: 20000,
  });
}

function onSaveSuccess(data: DriverAdminDto, router: ReturnType<typeof useRouter>) {
  if (data.generatedTemporaryPassword) {
    showGeneratedPasswordToast(data.generatedTemporaryPassword);
  } else {
    toast.success('Guardado');
  }
  router.push('/admin/drivers');
}

export function AdminDriverFormPage() {
  const id = useParams().id as string | undefined;
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = Boolean(id);
  const { data: drivers } = useQuery({
    queryKey: queryKeys.adminDrivers,
    queryFn: adminApi.listDrivers,
    enabled: isEdit,
  });
  const item = drivers?.find((d) => d.id === id);

  const form = useForm<DriverFormValues>({
    values: item ? toFormValues(item) : emptyValues,
  });

  const save = useMutation({
    mutationFn: (body: ReturnType<typeof toSaveBody>) =>
      adminApi.saveDriver(body, isEdit ? id : undefined),
    onSuccess: (data) => onSaveSuccess(data, router),
    onError: (e: Error) => toast.error(e.message),
  });

  const resetTempPassword = useMutation({
    mutationFn: () => adminApi.setDriverTemporaryPassword(id!),
    onSuccess: async (data) => {
      await qc.invalidateQueries({ queryKey: queryKeys.adminDrivers });
      showGeneratedPasswordToast(data.temporaryPassword);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const pageTitle = isEdit ? 'Editar' : 'Crear';

  const onSubmit = (d: DriverFormValues) => {
    save.mutate(toSaveBody(d));
  };

  return (
    <div>
      <div className="sticky top-0 z-30 -mx-6 border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <Link href="/admin/dashboard" className="transition hover:text-slate-200">
            Dashboard
          </Link>
          <span className="mx-2 text-slate-600">/</span>
          <Link href="/admin/drivers" className="transition hover:text-slate-200">
            Conductores
          </Link>
          <span className="mx-2 text-slate-600">/</span>
          <span className="text-slate-200">{pageTitle}</span>
        </nav>
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-100">{pageTitle}</h1>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto mt-6 max-w-2xl rounded-xl border border-white/10 bg-slate-900/40 p-6"
      >
        <div className="space-y-4">
          <div>
            <Label className={labelClassName}>Nombre</Label>
            <Input className={inputClassName} {...form.register('name', { required: true })} />
          </div>
          <div>
            <Label className={labelClassName}>Teléfono</Label>
            <Input className={inputClassName} {...form.register('phone', { required: true })} />
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/30 p-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-200">Acceso a la app (repartidor)</p>
              <p className="mt-1 text-xs text-slate-500">
                El email será el usuario de login. La contraseña temporal la genera el servidor al crear
                el conductor o al regenerarla. El repartidor deberá cambiarla al iniciar sesión.
              </p>
            </div>
            <div>
              <Label className={labelClassName}>Email</Label>
              <Input type="email" className={inputClassName} {...form.register('email')} />
            </div>
            {isEdit && item && (
              <div className="text-xs text-slate-400 space-y-2">
                <p>
                  Cuenta:{' '}
                  <span className="text-slate-200">{item.hasLoginAccount ? 'Sí' : 'No'}</span>
                  {item.loginEmail ? ` · ${item.loginEmail}` : ''}
                </p>
                {item.mustChangePassword && (
                  <p className="text-amber-300">Pendiente de cambiar contraseña al iniciar sesión.</p>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={resetTempPassword.isPending || !item.email?.trim()}
                  onClick={() => resetTempPassword.mutate()}
                >
                  Regenerar contraseña temporal
                </Button>
              </div>
            )}
          </div>
          <div>
            <Label className={labelClassName}>Licencia</Label>
            <Input className={inputClassName} {...form.register('licenseNumber')} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className={labelClassName}>Tipo de vehículo</Label>
              <Input className={inputClassName} {...form.register('vehicleType')} />
            </div>
            <div>
              <Label className={labelClassName}>Placas</Label>
              <Input className={inputClassName} {...form.register('vehiclePlate')} />
            </div>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-slate-950/40 accent-blue-500"
              {...form.register('isActive')}
            />
            Activo
          </label>
          <div>
            <Label className={labelClassName}>Notas</Label>
            <textarea
              rows={4}
              className={inputClassName}
              {...form.register('notes')}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            disabled={save.isPending}
          >
            GUARDAR
          </Button>
        </div>
      </form>
    </div>
  );
}
