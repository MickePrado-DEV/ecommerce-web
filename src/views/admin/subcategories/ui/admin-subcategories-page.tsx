'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { adminApi } from '@/entities/admin/api/admin-api';
import { SUBCATEGORY_TABLE_CONFIG } from '@/domain/subcategories/subcategory.table';
import { useAdminTableQuery } from '@/features/admin/table/model/use-admin-table-query';
import { useAdminFilterOptions } from '@/features/admin/table/model/use-admin-filter-options';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';
import { AdminDataTable } from '@/widgets/admin/data-table/ui/admin-data-table';
import { toast } from 'sonner';

export function AdminSubcategoriesPage() {
  const qc = useQueryClient();
  const table = useAdminTableQuery({
    queryKey: queryKeys.adminSubcategoriesTable,
    fetchPage: adminApi.listSubcategoriesPaged,
    tableConfig: SUBCATEGORY_TABLE_CONFIG,
    filterKeys: { name: 'name', categoryName: 'categoryName', familyName: 'familyName' },
  });
  const filterOpts = useAdminFilterOptions(table.groupFilters);

  const del = useMutation({
    mutationFn: adminApi.deleteSubcategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'subcategories', 'table'] });
      qc.invalidateQueries({ queryKey: queryKeys.families });
      toast.success('Subcategoría eliminada');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        title="Subcategorías"
        action={
          <Button asChild className="bg-violet-600 hover:bg-violet-500">
            <Link href="/admin/subcategories/new">+ Crear subcategoría</Link>
          </Button>
        }
      />
      <AdminDataTable
        data={table.data}
        tableConfig={SUBCATEGORY_TABLE_CONFIG}
        loading={table.isLoading}
        fetchError={table.isError ? (table.error instanceof Error ? table.error.message : 'Error desconocido') : null}
        paging={table.paging}
        sort={table.sort}
        filters={table.filters}
        groupFilters={table.groupFilters}
        filterOptions={filterOpts}
        onSort={table.onSort}
        onPageChange={table.onPageChange}
        onFilterChange={table.onFilterChange}
        onGroupFiltersChange={table.onGroupFiltersChange}
        onRowAction={(actionId, row) => {
          if (actionId === 'delete') del.mutate(row.id);
        }}
      />
    </div>
  );
}
