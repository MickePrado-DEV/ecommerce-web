'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { FAMILY_TABLE_CONFIG } from '@/entities/admin/config/family-table.config';
import { useAdminTableQuery } from '@/features/admin/table/model/use-admin-table-query';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { AdminDataTable } from '@/widgets/admin/data-table/ui/admin-data-table';
import { toast } from 'sonner';

export function AdminFamiliesPage() {
  const qc = useQueryClient();
  const table = useAdminTableQuery({
    queryKey: queryKeys.adminFamiliesTable,
    fetchPage: adminApi.listFamiliesPaged,
    tableConfig: FAMILY_TABLE_CONFIG,
    filterKeys: { name: 'name' },
  });

  const del = useMutation({
    mutationFn: adminApi.deleteFamily,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'families', 'table'] });
      qc.invalidateQueries({ queryKey: queryKeys.adminFamilies });
      toast.success('Familia eliminada');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Familias"
        action={
          <Button asChild className="bg-violet-600 hover:bg-violet-500">
            <Link href="/admin/families/new">+ Crear familia</Link>
          </Button>
        }
      />
      <AdminDataTable
        data={table.data}
        tableConfig={FAMILY_TABLE_CONFIG}
        loading={table.isLoading}
        paging={table.paging}
        sort={table.sort}
        filters={table.filters}
        onSort={table.onSort}
        onPageChange={table.onPageChange}
        onFilterChange={table.onFilterChange}
        onRowAction={(actionId, row) => {
          if (actionId === 'delete') del.mutate(row.id);
        }}
      />
    </div>
  );
}
