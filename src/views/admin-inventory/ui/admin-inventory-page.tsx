'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { toast } from 'sonner';

export function AdminInventoryPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: queryKeys.adminInventory, queryFn: adminApi.listInventory });
  const [editing, setEditing] = useState<Record<string, number>>({});

  const save = useMutation({
    mutationFn: ({ variantId, qty }: { variantId: string; qty: number }) =>
      adminApi.setInventory(variantId, qty),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminInventory });
      toast.success('Stock actualizado');
    },
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader title="Inventario" />
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-white/10 text-zinc-400">
            <th className="p-2">SKU</th><th className="p-2">Producto</th><th className="p-2">Disponible</th><th className="p-2">Ajustar</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((row) => (
            <tr key={row.variantId} className="border-b border-white/5">
              <td className="p-2">{row.sku}</td>
              <td className="p-2">{row.productName}</td>
              <td className="p-2">{row.available}</td>
              <td className="p-2 flex gap-2">
                <Input
                  type="number"
                  className="w-24"
                  value={editing[row.variantId] ?? row.quantityOnHand}
                  onChange={(e) =>
                    setEditing((s) => ({ ...s, [row.variantId]: Number(e.target.value) }))
                  }
                />
                <Button
                  size="sm"
                  onClick={() =>
                    save.mutate({
                      variantId: row.variantId,
                      qty: editing[row.variantId] ?? row.quantityOnHand,
                    })
                  }
                >
                  Guardar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
