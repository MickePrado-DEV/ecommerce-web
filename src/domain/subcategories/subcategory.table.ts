import type { AdminTableConfig } from '@/shared/types/admin-table-config';
import type { SubcategoryAdminRowDto } from '@/entities/admin/model/types';

/** Configuración de tabla Admin — Subcategorías (dominio). */
export const SUBCATEGORY_TABLE_CONFIG: AdminTableConfig<SubcategoryAdminRowDto> = {
  tableId: 'admin-subcategories',
  frozen: { left: 1 },
  defaultSort: { key: 'name', direction: 'asc' },
  pagination: {
    enabled: true,
    mode: 'server',
    pageSizeOptions: [10, 20, 50],
    defaultPageSize: 10,
  },
  emptyState: {
    title: 'No hay subcategorías',
    description: 'Ajusta filtros o crea una subcategoría nueva.',
  },
  loadingRows: 6,
  columns: [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      fit: true,
      width: 100,
      value: (row) => row.id.slice(0, 8),
      cellClassName: 'font-mono text-xs text-zinc-500',
    },
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      filter: { ui: 'input', mode: 'contains', placeholder: 'Buscar nombre…' },
    },
    {
      key: 'categoryName',
      header: 'Categoría',
      sortable: true,
      // Cambia ui a 'input' si prefieres texto en lugar de multi-select
      filter: {
        ui: 'multi-select',
        field: 'categoryId',
        placeholder: 'Categoría…',
        optionsSource: { kind: 'remote', loaderKey: 'categories' },
        searchableInOptions: true,
      },
    },
    {
      key: 'familyName',
      header: 'Familia',
      sortable: true,
      filter: {
        ui: 'multi-select',
        field: 'familyId',
        placeholder: 'Familia…',
        optionsSource: { kind: 'remote', loaderKey: 'families' },
        searchableInOptions: true,
      },
    },
  ],
  actions: [
    {
      id: 'edit',
      label: 'Editar',
      icon: 'edit',
      href: (row) => `/admin/subcategories/${row.id}/edit`,
    },
    {
      id: 'delete',
      label: 'Eliminar',
      icon: 'delete',
      variant: 'danger',
      emit: 'delete',
    },
  ],
};
