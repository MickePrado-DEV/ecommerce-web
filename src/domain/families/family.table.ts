import type { AdminTableConfig } from '@/shared/types/admin-table-config';
import type { FamilyAdminDto } from '@/entities/admin/model/types';

/** Configuración de tabla Admin — Familias (dominio). */
export const FAMILY_TABLE_CONFIG: AdminTableConfig<FamilyAdminDto> = {
  tableId: 'admin-families',
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
      searchable: true,
      filter: { mode: 'contains', placeholder: 'Buscar nombre…' },
    },
  ],
  filterGroups: [
    {
      id: 'initial',
      label: 'Inicial',
      field: 'nameInitial',
      mode: 'multi',
      type: 'checkbox',
      operator: 'in',
      optionsSource: {
        kind: 'static',
        options: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((ch) => ({
          label: ch,
          value: ch,
        })),
      },
      layout: 'chips',
    },
    {
      id: 'id-range',
      label: 'Rango orden',
      field: 'idBucket',
      mode: 'multi',
      type: 'checkbox',
      operator: 'in',
      optionsSource: {
        kind: 'static',
        options: [
          { label: '1 – 50', value: '1-50' },
          { label: '51 – 100', value: '51-100' },
          { label: '101 – 200', value: '101-200' },
          { label: '201+', value: '201-9999' },
        ],
      },
    },
  ],
  actions: [
    {
      id: 'edit',
      label: 'Editar',
      icon: 'edit',
      href: (row) => `/admin/families/${row.id}/edit`,
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
