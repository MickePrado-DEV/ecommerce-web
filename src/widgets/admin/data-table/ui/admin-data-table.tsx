'use client';

import Link from 'next/link';
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash2 } from 'lucide-react';
import type {
  AdminDataTableEvents,
  AdminTableActionDef,
  AdminTableColumnDef,
  AdminTableConfig,
  AdminTablePagingState,
  AdminTableSortState,
  FilterOption,
  GroupFiltersState,
  SortDirection,
  TableActionIcon,
} from '@/shared/types/admin-table-config';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import {
  buildStickyOffsets,
  formatCellValue,
  getCellValue,
} from '@/widgets/admin/data-table/lib/table-data';
import { TablePagination } from '@/widgets/admin/data-table/ui/table-pagination';
import { AdminTableFilterBar } from '@/widgets/admin/data-table/ui/admin-table-filter-bar';
import {
  AdminTableColumnFilter,
  columnHasFilter,
  getColumnFilterUi,
} from '@/widgets/admin/data-table/ui/admin-table-column-filter';

export interface AdminDataTableProps<TRow extends object>
  extends AdminDataTableEvents<TRow> {
  data: TRow[];
  tableConfig: AdminTableConfig<TRow>;
  loading?: boolean;
  /** Mensaje si falló la carga (p. ej. error 400/500 del API) */
  fetchError?: string | null;
  paging: AdminTablePagingState;
  sort?: AdminTableSortState | null;
  filters?: Record<string, string>;
  groupFilters?: GroupFiltersState;
  filterOptions?: Record<string, FilterOption[]>;
  quickSearch?: string;
}

function nextSortDirection(current: SortDirection | null): SortDirection | null {
  if (current === null) return 'asc';
  if (current === 'asc') return 'desc';
  return null;
}

function SortIcon({ direction }: { direction: SortDirection | null }) {
  if (direction === 'asc') return <ArrowUp className="h-3.5 w-3.5" />;
  if (direction === 'desc') return <ArrowDown className="h-3.5 w-3.5" />;
  return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
}

function ActionIcon({ icon }: { icon?: TableActionIcon }) {
  if (icon === 'edit') return <Pencil className="h-4 w-4" />;
  if (icon === 'delete') return <Trash2 className="h-4 w-4" />;
  return null;
}

function renderAction<TRow extends object>(
  action: AdminTableActionDef<TRow>,
  row: TRow,
  onRowAction?: (actionId: string, row: TRow) => void,
) {
  const icon = <ActionIcon icon={action.icon} />;
  if (action.href) {
    return (
      <Button
        key={action.id}
        size="sm"
        variant="outline"
        className="h-8 w-8 border-sky-500/30 p-0 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300"
        asChild
        title={action.label}
      >
        <Link href={action.href(row)} aria-label={action.label}>
          {icon}
        </Link>
      </Button>
    );
  }
  return (
    <Button
      key={action.id}
      size="sm"
      variant="ghost"
      className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
      title={action.label}
      aria-label={action.label}
      onClick={(e) => {
        e.stopPropagation();
        onRowAction?.(action.id, row);
      }}
    >
      {icon}
    </Button>
  );
}

export function AdminDataTable<TRow extends object>({
  data,
  tableConfig,
  loading = false,
  fetchError = null,
  paging,
  sort = null,
  filters = {},
  groupFilters = {},
  filterOptions = {},
  quickSearch = '',
  onSort,
  onPageChange,
  onFilterChange,
  onGroupFiltersChange,
  onQuickSearchChange,
  onRowAction,
  onRowClick,
}: AdminDataTableProps<TRow>) {
  const paginationEnabled = tableConfig.pagination?.enabled ?? false;
  const columns = tableConfig.columns;
  const hasActions = (tableConfig.actions?.length ?? 0) > 0;
  const hasFilterRow = columns.some((c) => columnHasFilter(c.filter, c.searchable));

  const resolveOptions = (loaderKey: string) => filterOptions[loaderKey] ?? [];

  const handleColumnMultiChange = (field: string, values: string[]) => {
    onGroupFiltersChange?.({ ...groupFilters, [field]: values });
  };
  const frozenLeft = tableConfig.frozen?.left ?? 0;
  const leftOffsets = buildStickyOffsets(columns, frozenLeft);
  const density = tableConfig.density ?? 'comfortable';
  const cellPad = density === 'compact' ? 'p-2' : 'p-3';

  const stickyCell = (index: number) => {
    if (index >= frozenLeft) return {};
    return {
      position: 'sticky' as const,
      left: leftOffsets[index],
      zIndex: 20,
      backgroundColor: 'rgb(24 24 27)',
    };
  };

  const handleSort = (col: AdminTableColumnDef<TRow>) => {
    if (!col.sortable || !onSort) return;
    const nextDir = sort?.key === col.key ? nextSortDirection(sort?.direction ?? null) : 'asc';
    onSort({ key: col.key, direction: nextDir });
  };

  const pagination = paginationEnabled ? (
    <TablePagination
      page={paging.page}
      pageSize={paging.pageSize}
      total={paging.total}
      onPageChange={(p) => onPageChange?.(p, paging.pageSize)}
    />
  ) : null;

  return (
    <div data-table-id={tableConfig.tableId}>
      {(tableConfig.filterGroups?.length || tableConfig.quickSearch?.enabled) && (
        <AdminTableFilterBar
          groups={tableConfig.filterGroups ?? []}
          value={groupFilters}
          optionsByLoader={filterOptions}
          quickSearch={
            tableConfig.quickSearch?.enabled
              ? { placeholder: tableConfig.quickSearch.placeholder }
              : undefined
          }
          quickSearchValue={quickSearch}
          onQuickSearchChange={onQuickSearchChange}
          onChange={(next) => onGroupFiltersChange?.(next)}
        />
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-max text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-zinc-900/50 text-zinc-400">
              {columns.map((col, index) => (
                <th
                  key={col.key}
                  style={stickyCell(index)}
                  className={cn(
                    cellPad,
                    'font-medium uppercase tracking-wide text-xs',
                    col.fit && 'w-0 whitespace-nowrap',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                    col.headerClassName,
                  )}
                >
                  <div
                    className={cn(
                      'flex items-center gap-1.5',
                      col.sortable && 'cursor-pointer select-none hover:text-zinc-200',
                    )}
                    onClick={() => handleSort(col)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSort(col)}
                    role={col.sortable ? 'button' : undefined}
                    tabIndex={col.sortable ? 0 : undefined}
                  >
                    <span>{col.header}</span>
                    {col.sortable && (
                      <SortIcon direction={sort?.key === col.key ? (sort.direction ?? null) : null} />
                    )}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th className={cn(cellPad, 'w-24 text-right font-medium uppercase tracking-wide text-xs')}>
                  Acciones
                </th>
              )}
            </tr>
            {hasFilterRow && (
              <tr className="border-b border-white/10 bg-zinc-950/80">
                {columns.map((col, index) => {
                  const showFilter = columnHasFilter(col.filter, col.searchable);
                  const isMulti =
                    showFilter &&
                    getColumnFilterUi(col.filter) === 'multi-select' &&
                    col.filter?.field &&
                    col.filter.optionsSource;

                  const multiOptions =
                    isMulti && col.filter?.optionsSource?.kind === 'remote'
                      ? resolveOptions(col.filter.optionsSource.loaderKey)
                      : isMulti && col.filter?.optionsSource?.kind === 'static'
                        ? col.filter.optionsSource.options
                        : [];

                  return (
                    <th
                      key={`filter-${col.key}`}
                      style={stickyCell(index)}
                      className={cn(cellPad, col.fit && 'w-0')}
                    >
                      {showFilter ? (
                        <AdminTableColumnFilter
                          filter={col.filter}
                          searchable={col.searchable}
                          textValue={filters[col.key] ?? ''}
                          selected={
                            isMulti && col.filter?.field
                              ? (groupFilters[col.filter.field] ?? [])
                              : []
                          }
                          options={multiOptions}
                          onTextChange={(value) =>
                            onFilterChange?.({ ...filters, [col.key]: value })
                          }
                          onMultiChange={(values) =>
                            col.filter?.field &&
                            handleColumnMultiChange(col.filter.field, values)
                          }
                        />
                      ) : null}
                    </th>
                  );
                })}
                {hasActions && <th className={cellPad} />}
              </tr>
            )}
          </thead>
          <tbody>
            {loading && !data.length ? (
              Array.from({ length: tableConfig.loadingRows ?? 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td colSpan={columns.length + (hasActions ? 1 : 0)} className={cellPad}>
                    <div className="h-9 animate-pulse rounded bg-zinc-800/80" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="p-8 text-center text-zinc-500"
                >
                  <p className="font-medium text-zinc-300">
                    {fetchError ? 'Error al cargar datos' : (tableConfig.emptyState?.title ?? 'Sin registros')}
                  </p>
                  <p className="mt-1 text-sm">
                    {fetchError ?? tableConfig.emptyState?.description}
                  </p>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const rowKey =
                  (row as Record<string, unknown>).id != null
                    ? String((row as Record<string, unknown>).id)
                    : rowIndex;
                return (
                  <tr
                    key={rowKey}
                    className={cn(
                      'border-b border-white/5 transition hover:bg-white/[0.02]',
                      tableConfig.rowClick?.enabled && 'cursor-pointer',
                    )}
                    onClick={() => tableConfig.rowClick?.enabled && onRowClick?.(row)}
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={col.key}
                        style={stickyCell(colIndex)}
                        className={cn(
                          cellPad,
                          col.fit && 'w-0 whitespace-nowrap',
                          col.align === 'center' && 'text-center',
                          col.align === 'right' && 'text-right',
                          col.cellClassName,
                        )}
                      >
                        {col.render
                          ? col.render(row)
                          : formatCellValue(getCellValue(row, col))}
                      </td>
                    ))}
                    {hasActions && (
                      <td className={cn(cellPad, 'text-right')}>
                        <div className="flex justify-end gap-1">
                          {tableConfig.actions?.map((action) => {
                            if (action.visible && !action.visible(row)) return null;
                            return renderAction(action, row, onRowAction);
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {pagination}
    </div>
  );
}
