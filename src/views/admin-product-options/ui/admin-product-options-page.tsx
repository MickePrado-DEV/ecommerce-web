'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

type FeatureRow = { value: string; description: string };

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Equivalente ManageOptions + NewOptionForm (por producto en .NET). */
export function AdminProductOptionsPage() {
  const productId = useParams().id as string;
  const [showModal, setShowModal] = useState(false);
  const [optionName, setOptionName] = useState('');
  const [optionType, setOptionType] = useState<1 | 2>(1);
  const [features, setFeatures] = useState<FeatureRow[]>([{ value: '', description: '' }]);

  const { data, refetch } = useQuery({
    queryKey: ['admin-options', productId],
    queryFn: () => adminApi.listProductOptions(productId),
  });

  const createOptionWithValues = useMutation({
    mutationFn: async () => {
      const opt = await adminApi.saveProductOption(productId, {
        name: optionName,
        optionType,
        sortOrder: 0,
      });
      for (const f of features) {
        if (!f.value.trim()) continue;
        await adminApi.saveOptionValue(productId, opt.id, { value: f.value.trim(), sortOrder: 0 });
      }
      return opt;
    },
    onSuccess: () => {
      toast.success('Opción creada');
      setShowModal(false);
      setOptionName('');
      setFeatures([{ value: '', description: '' }]);
      refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addValue = useMutation({
    mutationFn: ({ optionId, value }: { optionId: string; value: string }) =>
      adminApi.saveOptionValue(productId, optionId, { value, sortOrder: 0 }),
    onSuccess: () => {
      toast.success('Valor añadido');
      refetch();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeOption = useMutation({
    mutationFn: (optionId: string) => adminApi.deleteProductOption(productId, optionId),
    onSuccess: () => {
      toast.success('Opción eliminada');
      refetch();
    },
  });

  const removeValue = useMutation({
    mutationFn: ({ optionId, valueId }: { optionId: string; valueId: string }) =>
      adminApi.deleteOptionValue(productId, optionId, valueId),
    onSuccess: () => {
      toast.success('Valor eliminado');
      refetch();
    },
  });

  const validateAndSave = () => {
    if (!optionName.trim()) {
      toast.error('Nombre de opción requerido');
      return;
    }
    for (const f of features) {
      if (!f.value.trim()) continue;
      if (optionType === 2 && !HEX_RE.test(f.value.trim())) {
        toast.error('Color inválido: use formato #RGB o #RRGGBB');
        return;
      }
    }
    if (!features.some((f) => f.value.trim())) {
      toast.error('Al menos un valor/feature');
      return;
    }
    createOptionWithValues.mutate();
  };

  return (
    <div>
      <PageHeader
        title="Opciones del producto"
        action={
          <div className="flex gap-2">
            <Button onClick={() => setShowModal(true)}>Nueva opción</Button>
            <Button variant="outline" asChild>
              <Link href="/admin/products">← Productos</Link>
            </Button>
          </div>
        }
      />

      {showModal && (
        <div className="mb-8 rounded-lg border border-violet-500/30 bg-white/5 p-6">
          <h3 className="mb-4 font-semibold">Nueva opción (modal)</h3>
          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Nombre</Label>
              <Input value={optionName} onChange={(e) => setOptionName(e.target.value)} placeholder="Color, Talla…" />
            </div>
            <div>
              <Label>Tipo</Label>
              <select
                className="mt-1 w-full rounded-md border border-white/10 bg-zinc-900 px-3 py-2 text-sm"
                value={optionType}
                onChange={(e) => setOptionType(Number(e.target.value) as 1 | 2)}
              >
                <option value={1}>Texto</option>
                <option value={2}>Color (hex)</option>
              </select>
            </div>
          </div>
          <div className="space-y-3">
            <Label>Valores / features</Label>
            {features.map((f, i) => (
              <div key={i} className="flex flex-wrap gap-2">
                {optionType === 2 ? (
                  <input
                    type="color"
                    value={f.value.startsWith('#') ? f.value : '#000000'}
                    onChange={(e) => {
                      const next = [...features];
                      next[i] = { ...next[i], value: e.target.value };
                      setFeatures(next);
                    }}
                    className="h-10 w-14 cursor-pointer rounded border border-white/10"
                  />
                ) : null}
                <Input
                  placeholder={optionType === 2 ? '#ff0000' : 'Valor'}
                  value={f.value}
                  onChange={(e) => {
                    const next = [...features];
                    next[i] = { ...next[i], value: e.target.value };
                    setFeatures(next);
                  }}
                  className="max-w-xs"
                />
                <Input
                  placeholder="Descripción (opcional)"
                  value={f.description}
                  onChange={(e) => {
                    const next = [...features];
                    next[i] = { ...next[i], description: e.target.value };
                    setFeatures(next);
                  }}
                  className="max-w-xs"
                />
                {features.length > 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setFeatures((rows) => rows.filter((_, j) => j !== i))}
                  >
                    Quitar
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setFeatures((rows) => [...rows, { value: '', description: '' }])}
            >
              Añadir fila
            </Button>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={validateAndSave} disabled={createOptionWithValues.isPending}>
              Guardar opción
            </Button>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <ul className="space-y-6">
        {data?.map((opt) => (
          <li key={opt.id} className="rounded-lg border border-white/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">
                {opt.name}{' '}
                <span className="text-xs text-zinc-500">
                  ({(opt.optionType ?? 1) === 2 ? 'Color' : 'Texto'})
                </span>
              </p>
              <Button size="sm" variant="ghost" className="text-red-400" onClick={() => removeOption.mutate(opt.id)}>
                Eliminar opción
              </Button>
            </div>
            <ul className="mt-3 space-y-2">
              {opt.values.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    {(opt.optionType ?? 1) === 2 && (
                      <span
                        className="inline-block h-5 w-5 rounded border border-white/20"
                        style={{ backgroundColor: v.value }}
                      />
                    )}
                    {v.value}
                  </span>
                  <Button size="sm" variant="ghost" onClick={() => removeValue.mutate({ optionId: opt.id, valueId: v.id })}>
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
            <AddValueInline
              optionType={opt.optionType ?? 1}
              onAdd={(value) => addValue.mutate({ optionId: opt.id, value })}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddValueInline({ optionType, onAdd }: { optionType: number; onAdd: (v: string) => void }) {
  const [value, setValue] = useState('');
  return (
    <div className="mt-3 flex gap-2">
      {optionType === 2 && (
        <input
          type="color"
          onChange={(e) => setValue(e.target.value)}
          className="h-9 w-12 rounded border border-white/10"
        />
      )}
      <Input placeholder="Nuevo valor" value={value} onChange={(e) => setValue(e.target.value)} className="max-w-xs" />
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          const v = value.trim();
          if (!v) return;
          if (optionType === 2 && !HEX_RE.test(v)) {
            toast.error('Hex inválido');
            return;
          }
          onAdd(v);
          setValue('');
        }}
      >
        Añadir valor
      </Button>
    </div>
  );
}
