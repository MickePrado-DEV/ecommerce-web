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
  SortDirection,
  TableActionIcon,
} from '@/shared/types/admin-table-config';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import {
  buildStickyOffsets,
  formatCellValue,
  getCellValue,
} from '@/widgets/admin/data-table/lib/table-data';

export interface AdminDataTableProps<TRow extends object>
  extends AdminDataTableEvents<TRow> {
  data: TRow[];
  tableConfig: AdminTableConfig<TRow>;
  loading?: boolean;
  paging: AdminTablePagingState;
  sort?: AdminTableSortState | null;
  filters?: Record<string, string>;
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

function TablePagination({
  page,
  pageSize,
  total,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
      <span>
        Página {page} de {totalPages} ({total} total)
      </span>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="min-w-9 px-3"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="min-w-9 px-3"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
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
        className="h-8 w-8 p-0"
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
      className={cn(
        'h-8 w-8 p-0',
        action.variant === 'danger' && 'text-red-400 hover:text-red-300',
      )}
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
  paging,
  sort = null,
  filters = {},
  onSort,
  onPageChange,
  onFilterChange,
  onRowAction,
  onRowClick,
}: AdminDataTableProps<TRow>) {
  const paginationEnabled = tableConfig.pagination?.enabled ?? false;
  const columns = tableConfig.columns;
  const hasActions = (tableConfig.actions?.length ?? 0) > 0;
  const hasSearchable = columns.some((c) => c.searchable);
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

  if (loading && !data.length) {
    const skeletonRows = tableConfig.loadingRows ?? 5;
    return (
      <div data-table-id={tableConfig.tableId}>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <div className="animate-pulse space-y-2 p-4">
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-zinc-800/80" />
            ))}
          </div>
        </div>
        {pagination}
      </div>
    );
  }

  return (
    <div data-table-id={tableConfig.tableId}>
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
            {hasSearchable && (
              <tr className="border-b border-white/10 bg-zinc-950/80">
                {columns.map((col, index) => (
                  <th
                    key={`filter-${col.key}`}
                    style={stickyCell(index)}
                    className={cn(cellPad, col.fit && 'w-0')}
                  >
                    {col.searchable ? (
                      <Input
                        placeholder={col.filter?.placeholder ?? `Buscar ${col.header.toLowerCase()}…`}
                        value={filters[col.key] ?? ''}
                        onChange={(e) =>
                          onFilterChange?.({ ...filters, [col.key]: e.target.value })
                        }
                        className="h-8 text-xs"
                      />
                    ) : null}
                  </th>
                ))}
                {hasActions && <th className={cellPad} />}
              </tr>
            )}
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="p-8 text-center text-zinc-500"
                >
                  <p className="font-medium text-zinc-300">
                    {tableConfig.emptyState?.title ?? 'Sin registros'}
                  </p>
                  {tableConfig.emptyState?.description && (
                    <p className="mt-1 text-sm">{tableConfig.emptyState.description}</p>
                  )}
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
