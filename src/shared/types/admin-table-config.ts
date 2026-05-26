import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';
export type ColumnType = 'text' | 'number' | 'date' | 'datetime' | 'badge' | 'custom';
export type TableVariant = 'default' | 'compact';
export type TableDensity = 'comfortable' | 'compact';
export type PaginationMode = 'server' | 'client';
export type FilterMode = 'contains' | 'equals' | 'startsWith' | 'range' | 'dateRange';
export type ActionVariant = 'primary' | 'danger' | 'ghost' | 'outline';
export type TableActionIcon = 'edit' | 'delete' | 'view';

export interface ColumnFilterConfig {
  mode: FilterMode;
  placeholder?: string;
}

export interface AdminTableColumnDef<TRow> {
  key: string;
  header: string;
  type?: ColumnType;
  sortable?: boolean;
  fit?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  searchable?: boolean;
  dateFormat?: string;
  value?: (row: TRow) => unknown;
  render?: (row: TRow) => ReactNode;
  cellClassName?: string;
  headerClassName?: string;
  filter?: ColumnFilterConfig;
}

export interface AdminTableActionDef<TRow> {
  id: string;
  label: string;
  icon?: TableActionIcon;
  variant?: ActionVariant;
  /** Enlace de navegación (p. ej. editar). */
  href?: (row: TRow) => string;
  /** Botón que emite onRowAction. */
  event?: 'click';
  visible?: (row: TRow) => boolean;
}

export interface AdminTableFrozenConfig {
  left?: number;
  right?: number;
}

export interface AdminTablePaginationConfig {
  enabled: boolean;
  mode: PaginationMode;
  pageSizeOptions: number[];
  defaultPageSize: number;
}

export interface AdminTableEmptyState {
  title: string;
  description?: string;
}

export interface AdminTableConfig<TRow> {
  tableId: string;
  variant?: TableVariant;
  density?: TableDensity;
  frozen?: AdminTableFrozenConfig;
  columns: AdminTableColumnDef<TRow>[];
  defaultSort?: { key: string; direction: SortDirection };
  actions?: AdminTableActionDef<TRow>[];
  rowClick?: { enabled: boolean };
  selectable?: boolean;
  pagination?: AdminTablePaginationConfig;
  emptyState?: AdminTableEmptyState;
  loadingRows?: number;
}

export interface AdminTableSortState {
  key: string;
  direction: SortDirection | null;
}

export interface AdminTablePagingState {
  page: number;
  pageSize: number;
  total: number;
}

export interface AdminDataTableEvents<TRow> {
  onSort?: (sort: AdminTableSortState) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onRowAction?: (actionId: string, row: TRow) => void;
  onRowClick?: (row: TRow) => void;
}
