import type {
  AdminTableColumnDef,
  AdminTableConfig,
  AdminTableSortState,
  SortDirection,
} from '@/shared/types/admin-table-config';

export function getCellValue<TRow>(row: TRow, column: AdminTableColumnDef<TRow>): unknown {
  if (column.value) return column.value(row);
  return (row as Record<string, unknown>)[column.key];
}

export function formatCellValue(value: unknown): string {
  if (value == null) return '—';
  if (typeof value === 'boolean') return value ? 'Sí' : 'No';
  return String(value);
}

export function compareValues(a: unknown, b: unknown, direction: SortDirection): number {
  const mul = direction === 'asc' ? 1 : -1;
  if (a == null && b == null) return 0;
  if (a == null) return 1 * mul;
  if (b == null) return -1 * mul;
  if (typeof a === 'number' && typeof b === 'number') return (a - b) * mul;
  return String(a).localeCompare(String(b), 'es', { sensitivity: 'base' }) * mul;
}

export function applyClientFilters<TRow>(
  rows: TRow[],
  columns: AdminTableColumnDef<TRow>[],
  filters: Record<string, string>,
): TRow[] {
  const entries = Object.entries(filters).filter(([, v]) => v.trim() !== '');
  if (!entries.length) return rows;

  return rows.filter((row) =>
    entries.every(([key, raw]) => {
      const col = columns.find((c) => c.key === key);
      if (!col) return true;
      const value = formatCellValue(getCellValue(row, col)).toLowerCase();
      const q = raw.trim().toLowerCase();
      const mode = col.filter?.mode ?? 'contains';
      if (mode === 'equals') return value === q;
      if (mode === 'startsWith') return value.startsWith(q);
      return value.includes(q);
    }),
  );
}

export function applyClientSort<TRow>(
  rows: TRow[],
  columns: AdminTableColumnDef<TRow>[],
  sort: AdminTableSortState | null,
): TRow[] {
  if (!sort?.key || !sort.direction) return rows;
  const col = columns.find((c) => c.key === sort.key);
  if (!col) return rows;

  return [...rows].sort((a, b) =>
    compareValues(getCellValue(a, col), getCellValue(b, col), sort.direction!),
  );
}

export function paginateClient<TRow>(rows: TRow[], page: number, pageSize: number): TRow[] {
  const start = (page - 1) * pageSize;
  return rows.slice(start, start + pageSize);
}

export function parseColumnWidth(width?: number | string): number | undefined {
  if (width == null) return undefined;
  if (typeof width === 'number') return width;
  const px = width.match(/^(\d+(?:\.\d+)?)px$/);
  if (px) return Number(px[1]);
  return undefined;
}

export function buildStickyOffsets<TRow>(
  columns: AdminTableColumnDef<TRow>[],
  frozenCount: number,
): number[] {
  const offsets: number[] = [];
  let acc = 0;
  for (let i = 0; i < frozenCount; i++) {
    offsets.push(acc);
    const w = parseColumnWidth(columns[i]?.width) ?? (columns[i]?.fit ? 88 : 140);
    acc += w;
  }
  return offsets;
}

export function getDefaultPageSize(config: Pick<AdminTableConfig<object>, 'pagination'>): number {
  return config.pagination?.defaultPageSize ?? 10;
}
