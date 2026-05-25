'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin/api/admin-api';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';
import Link from 'next/link';

export function AdminProductVariantsPage() {
  const { id: productId } = useParams<{ id: string }>();
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number | ''>('');

  const create = useMutation({
    mutationFn: () =>
      adminApi.saveVariant({
        productId,
        sku,
        price: price === '' ? null : Number(price),
        isActive: true,
      }),
    onSuccess: () => {
      toast.success('Variante creada');
      setSku('');
      setPrice('');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader title="Variantes del producto" action={<Button variant="outline" asChild><Link href="/admin/products">← Productos</Link></Button>} />
      <div className="max-w-md space-y-4 rounded-lg border border-white/10 p-6">
        <div><Label>SKU</Label><Input value={sku} onChange={(e) => setSku(e.target.value)} /></div>
        <div><Label>Precio (opcional)</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} /></div>
        <Button onClick={() => create.mutate()} disabled={!sku}>Crear variante</Button>
      </div>
      <p className="mt-4 text-sm text-zinc-500">Gestiona stock en Inventario tras crear la variante.</p>
    </div>
  );
}
