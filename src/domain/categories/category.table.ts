import type { AdminTableConfig } from '@/shared/types/admin-table-config';
import type { CategoryAdminRowDto } from '@/entities/admin/model/types';

/** Configuración de tabla Admin — Categorías (dominio). */
export const CATEGORY_TABLE_CONFIG: AdminTableConfig<CategoryAdminRowDto> = {
  tableId: 'admin-categories',
  frozen: { left: 1 },
  defaultSort: { key: 'name', direction: 'asc' },
  pagination: {
    enabled: true,
    mode: 'server',
    pageSizeOptions: [10, 20, 50],
    defaultPageSize: 10,
  },
  quickSearch: {
    enabled: true,
    placeholder: 'Buscar categorías (ej. televisores)…',
    fields: ['name'],
  },
  emptyState: {
    title: 'No hay categorías',
    description: 'Ajusta filtros o crea una categoría nueva.',
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
      key: 'familyName',
      header: 'Familia',
      sortable: true,
      // ui: 'input' + placeholder 'Buscar familia…' para filtro por texto (familyName)
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
      href: (row) => `/admin/categories/${row.id}/edit`,
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
