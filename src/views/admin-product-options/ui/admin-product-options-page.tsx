'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';

export function AdminProductOptionsPage() {
  const productId = useParams().id as string;
  const [optionName, setOptionName] = useState('');
  const [valueInputs, setValueInputs] = useState<Record<string, string>>({});

  const { data, refetch } = useQuery({
    queryKey: ['admin-options', productId],
    queryFn: () => adminApi.listProductOptions(productId),
  });

  const createOption = useMutation({
    mutationFn: () => adminApi.saveProductOption(productId, { name: optionName, sortOrder: 0 }),
    onSuccess: () => {
      toast.success('Opción creada');
      setOptionName('');
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

  return (
    <div>
      <PageHeader
        title="Opciones del producto"
        action={
          <Button variant="outline" asChild>
            <Link href="/admin/products">← Productos</Link>
          </Button>
        }
      />
      <div className="mb-8 flex gap-2">
        <Input placeholder="Nueva opción (ej. Talla)" value={optionName} onChange={(e) => setOptionName(e.target.value)} />
        <Button onClick={() => createOption.mutate()} disabled={!optionName}>
          Añadir opción
        </Button>
      </div>
      <ul className="space-y-6">
        {data?.map((opt) => (
          <li key={opt.id} className="rounded-lg border border-white/10 p-4">
            <p className="font-medium">{opt.name}</p>
            <p className="mt-2 text-sm text-zinc-400">
              Valores: {opt.values.map((v) => v.value).join(', ') || '—'}
            </p>
            <div className="mt-3 flex gap-2">
              <Input
                placeholder="Nuevo valor"
                value={valueInputs[opt.id] ?? ''}
                onChange={(e) => setValueInputs((s) => ({ ...s, [opt.id]: e.target.value }))}
                className="max-w-xs"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const v = valueInputs[opt.id]?.trim();
                  if (v) addValue.mutate({ optionId: opt.id, value: v });
                }}
              >
                Añadir valor
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
