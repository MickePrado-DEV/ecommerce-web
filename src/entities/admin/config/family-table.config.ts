import type { AdminTableConfig } from '@/shared/types/admin-table-config';
import type { FamilyAdminDto } from '@/entities/admin/model/types';

export const FAMILY_TABLE_CONFIG: AdminTableConfig<FamilyAdminDto> = {
  tableId: 'admin-families',
  variant: 'default',
  density: 'comfortable',
  frozen: { left: 1 },
  defaultSort: { key: 'name', direction: 'asc' },
  pagination: {
    enabled: true,
    mode: 'server',
    pageSizeOptions: [10, 20, 50],
    defaultPageSize: 10,
  },
  emptyState: {
    title: 'No hay familias',
    description: 'Crea la primera familia con el botón superior.',
  },
  loadingRows: 6,
  columns: [
    {
      key: 'id',
      header: 'ID',
      type: 'text',
      sortable: true,
      fit: true,
      width: 120,
      value: (row) => row.id.slice(0, 8),
      cellClassName: 'font-mono text-xs text-zinc-500',
    },
    {
      key: 'name',
      header: 'Nombre',
      type: 'text',
      sortable: true,
      searchable: true,
      filter: { mode: 'contains', placeholder: 'Buscar nombre…' },
    },
  ],
  actions: [
    {
      id: 'edit',
      label: 'Editar',
      icon: 'edit',
      variant: 'outline',
      href: (row) => `/admin/families/${row.id}/edit`,
    },
    {
      id: 'delete',
      label: 'Eliminar',
      icon: 'delete',
      variant: 'danger',
      event: 'click',
    },
  ],
};
