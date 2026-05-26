'use client';

import { useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useWatch } from 'react-hook-form';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { resolveMediaUrl } from '@/shared/lib/media-url';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';

const MAX_ACTIVE = 5;
const ACCEPT = 'image/jpeg,image/png,image/webp';

interface CoverFormValues {
  title: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
}

function toInputDate(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toIsoDate(value: string) {
  if (!value) return null;
  return new Date(`${value}T12:00:00.000Z`).toISOString();
}

function isEndDatePast(endsAt: string) {
  if (!endsAt) return false;
  const end = new Date(`${endsAt}T23:59:59.999Z`);
  return end < new Date();
}

export function AdminCoverFormPage() {
  const id = useParams().id as string | undefined;
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = Boolean(id);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const { data: cover } = useQuery({
    queryKey: ['admin-cover', id],
    queryFn: () => adminApi.getCover(id!),
    enabled: isEdit,
  });

  const { data: allCovers } = useQuery({
    queryKey: queryKeys.adminCovers,
    queryFn: adminApi.listCovers,
  });

  const activeCount = useMemo(
    () =>
      (allCovers ?? []).filter(
        (c) => c.isEffectivelyActive && (!isEdit || c.id !== id),
      ).length,
    [allCovers, isEdit, id],
  );

  const form = useForm<CoverFormValues>({
    values: cover
      ? {
          title: cover.title,
          imageUrl: cover.imageUrl,
          linkUrl: cover.linkUrl ?? '',
          isActive: cover.isActive,
          startsAt: toInputDate(cover.startsAt),
          endsAt: toInputDate(cover.endsAt),
        }
      : {
          title: '',
          imageUrl: '',
          linkUrl: '',
          isActive: true,
          startsAt: '',
          endsAt: '',
        },
  });

  const watched = useWatch({ control: form.control });
  const endPast = isEndDatePast(watched.endsAt ?? '');
  const wouldBeActive = watched.isActive && !endPast;
  const atActiveLimit = wouldBeActive && activeCount >= MAX_ACTIVE;

  const save = useMutation({
    mutationFn: (body: {
      title: string;
      imageUrl: string;
      linkUrl: string | null;
      isActive: boolean;
      startsAt: string | null;
      endsAt: string | null;
    }) => adminApi.saveCover(body, isEdit ? id : undefined),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: queryKeys.adminCovers }),
        qc.invalidateQueries({ queryKey: ['admin', 'covers', 'paged'] }),
        qc.invalidateQueries({ queryKey: queryKeys.catalogHome }),
        ...(isEdit && id ? [qc.invalidateQueries({ queryKey: ['admin-cover', id] })] : []),
      ]);
      toast.success(isEdit ? 'Cambios guardados' : 'Portada creada');
      router.push('/admin/covers');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminApi.uploadCoverImage(file);
      form.setValue('imageUrl', url, { shouldValidate: true });
      toast.success('Imagen subida');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const onSubmit = (d: CoverFormValues) => {
    if (!d.imageUrl.trim()) {
      toast.error('Selecciona una imagen para la portada.');
      return;
    }
    if (atActiveLimit) {
      toast.error(`Solo puede haber ${MAX_ACTIVE} portadas activas y vigentes.`);
      return;
    }

    save.mutate({
      title: d.title.trim(),
      imageUrl: d.imageUrl.trim(),
      linkUrl: d.linkUrl.trim() || null,
      isActive: endPast ? false : d.isActive,
      startsAt: toIsoDate(d.startsAt),
      endsAt: toIsoDate(d.endsAt),
    });
  };

  const previewUrl = watched.imageUrl?.trim()
    ? resolveMediaUrl(watched.imageUrl.trim())
    : '';

  return (
    <div>
      <PageHeader title={isEdit ? 'Editar portada' : 'Nueva portada'} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
        <input type="hidden" {...form.register('imageUrl', { required: true })} />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
              <div className="relative aspect-[4/3] bg-zinc-800">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Vista previa" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-zinc-500">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPT}
              className="hidden"
              onChange={onPickFile}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? 'Subiendo…' : 'Cambiar imagen'}
            </Button>
            <p className="text-xs text-zinc-500">JPG, PNG o WebP. Máximo 5 MB.</p>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="title">Título</Label>
              <Input id="title" className="mt-1" {...form.register('title', { required: true })} />
            </div>
            <div>
              <Label htmlFor="linkUrl">Enlace (opcional)</Label>
              <Input id="linkUrl" className="mt-1" {...form.register('linkUrl')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="startsAt">Fecha inicio</Label>
                <Input id="startsAt" type="date" className="mt-1" {...form.register('startsAt')} />
              </div>
              <div>
                <Label htmlFor="endsAt">Fecha fin (opcional)</Label>
                <Input id="endsAt" type="date" className="mt-1" {...form.register('endsAt')} />
              </div>
            </div>
            {endPast && (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
                La fecha fin ya pasó; se marcará como inactiva al guardar.
              </p>
            )}
            {atActiveLimit && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                Ya hay {MAX_ACTIVE} portadas activas. Desactiva otra antes de activar esta.
              </p>
            )}
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <div>
                <p className="font-medium text-white">Estado</p>
                <p className="text-sm text-zinc-400">
                  {watched.isActive && !endPast ? 'Activo' : 'Inactivo'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={watched.isActive && !endPast}
                disabled={endPast}
                onClick={() => form.setValue('isActive', !watched.isActive)}
                className={cn(
                  'relative h-7 w-12 rounded-full transition',
                  watched.isActive && !endPast ? 'bg-violet-600' : 'bg-zinc-600',
                  endPast && 'cursor-not-allowed opacity-50',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-6 w-6 rounded-full bg-white transition',
                    watched.isActive && !endPast ? 'left-[22px]' : 'left-0.5',
                  )}
                />
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/covers">Cancelar</Link>
              </Button>
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500"
                disabled={save.isPending || uploading || atActiveLimit}
              >
                {isEdit ? 'Guardar cambios' : 'Crear portada'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
