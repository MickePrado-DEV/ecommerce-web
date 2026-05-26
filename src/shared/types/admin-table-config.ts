import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';
export type ColumnType = 'text' | 'number' | 'date' | 'datetime' | 'badge' | 'custom';
export type TableVariant = 'default' | 'compact';
export type TableDensity = 'comfortable' | 'compact';
export type PaginationMode = 'server' | 'client';
export type FilterMode = 'contains' | 'equals' | 'startsWith' | 'range' | 'dateRange';
export type ActionVariant = 'primary' | 'danger' | 'ghost' | 'outline';
export type TableActionIcon = 'edit' | 'delete' | 'view';
export type FilterGroupMode = 'multi' | 'single';
export type FilterGroupType = 'checkbox' | 'radio';
export type FilterOperator = 'in' | 'eq';
export type FilterOptionsSource =
  | { kind: 'static'; options: FilterOption[] }
  | { kind: 'remote'; loaderKey: string };

export interface FilterOption {
  label: string;
  value: string;
}

/** UI del filtro en la fila bajo el header de la columna */
export type ColumnFilterUi = 'input' | 'multi-select';

export interface ColumnFilterConfig {
  /** Por defecto: `input` si solo hay `searchable`; usa `multi-select` para checkbox en celda */
  ui?: ColumnFilterUi;
  mode?: FilterMode;
  placeholder?: string;
  /** Multi-select: campo de filtro servidor (`familyId` → `familyIds` en URL) */
  field?: string;
  optionsSource?: FilterOptionsSource;
  searchableInOptions?: boolean;
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
  href?: (row: TRow) => string;
  emit?: string;
  event?: 'click';
  visible?: (row: TRow) => boolean;
}

export interface AdminTableFilterGroupDef {
  id: string;
  label: string;
  field: string;
  mode?: FilterGroupMode;
  type?: FilterGroupType;
  operator?: FilterOperator;
  optionsSource: FilterOptionsSource;
  searchableInOptions?: boolean;
  layout?: 'inline' | 'stack' | 'chips';
  defaultValue?: string[] | string;
}

export interface AdminTableQuickSearchDef {
  enabled: boolean;
  placeholder?: string;
  fields: string[];
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
  filterGroups?: AdminTableFilterGroupDef[];
  quickSearch?: AdminTableQuickSearchDef;
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

/** Valores de grupos de filtro: field -> lista de values seleccionados */
export type GroupFiltersState = Record<string, string[]>;

export interface AdminDataTableEvents<TRow> {
  onSort?: (sort: AdminTableSortState) => void;
  onPageChange?: (page: number, pageSize: number) => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onGroupFiltersChange?: (filters: GroupFiltersState) => void;
  onQuickSearchChange?: (value: string) => void;
  onRowAction?: (actionId: string, row: TRow) => void;
  onRowClick?: (row: TRow) => void;
}
