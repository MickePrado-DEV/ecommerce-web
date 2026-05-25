'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/entities/admin/api/admin-api';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';

export function AdminProductOptionsPage() {
  const { id: productId } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const { data, refetch } = useQuery({
    queryKey: ['admin-options', productId],
    queryFn: () => adminApi.listProductOptions(productId),
  });

  const create = useMutation({
    mutationFn: () => adminApi.saveProductOption(productId, { name, sortOrder: 0 }),
    onSuccess: () => { toast.success('Opción creada'); setName(''); refetch(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title="Opciones del producto" action={<Button variant="outline" asChild><Link href="/admin/products">← Productos</Link></Button>} />
      <div className="mb-6 flex gap-2">
        <Input placeholder="Nombre opción (ej. Talla)" value={name} onChange={(e) => setName(e.target.value)} />
        <Button onClick={() => create.mutate()} disabled={!name}>Añadir</Button>
      </div>
      <ul className="space-y-4">
        {data?.map((opt) => (
          <li key={opt.id} className="rounded border border-white/10 p-4">
            <p className="font-medium">{opt.name}</p>
            <p className="text-sm text-zinc-400">{opt.values.map((v) => v.value).join(', ') || 'Sin valores'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
