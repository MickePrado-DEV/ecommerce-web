# AdminDataTable

Tabla reutilizable del panel admin. **La configuración vive en el dominio** (`src/domain/.../*.table.ts`), no en la página.

## Nueva tabla

1. Crea `src/domain/<entidad>/<entidad>.table.ts` exportando `AdminTableConfig<MiDto>`.
2. Define columnas, `filterGroups`, `quickSearch`, `pagination.mode: 'server'`, acciones, etc.
3. En la página:

```tsx
import { AdminDataTable } from '@/widgets/admin/data-table/ui/admin-data-table';
import { MI_TABLA_CONFIG } from '@/domain/mi-entidad/mi-entidad.table';
import { useAdminTableQuery } from '@/features/admin/table/model/use-admin-table-query';
import { useAdminFilterOptions } from '@/features/admin/table/model/use-admin-filter-options';

const { rows, total, state, handlers } = useAdminTableQuery({ config: MI_TABLA_CONFIG, fetcher });
const filterOptions = useAdminFilterOptions(MI_TABLA_CONFIG.filterGroups);

<AdminDataTable
  data={rows}
  tableConfig={MI_TABLA_CONFIG}
  loading={isLoading}
  paging={{ page: state.page, pageSize: state.pageSize, total }}
  groupFilters={state.groupFilters}
  filterOptions={filterOptions}
  onFiltersChange={handlers.setGroupFilters}
  onSortChange={handlers.setSort}
  onPageChange={handlers.setPage}
  onColumnSearchChange={handlers.setColumnSearch}
  onRowAction={(id, row) => { /* edit / delete */ }}
/>
```

## Configs del catálogo

| Entidad       | Config |
|---------------|--------|
| Familias      | `src/domain/families/family.table.ts` |
| Categorías    | `src/domain/categories/category.table.ts` |
| Subcategorías | `src/domain/subcategories/subcategory.table.ts` |

## Filtro por columna (`filter.ui`)

En cada columna, `filter` define el control bajo el header:

```ts
// Texto (contains → query según filterKeys de la página)
filter: { ui: 'input', mode: 'contains', placeholder: 'Buscar nombre…' }

// Multi-select (checkbox) en la celda — usa familyIds/categoryIds en URL
filter: {
  ui: 'multi-select',
  field: 'familyId',
  placeholder: 'Familia…',
  optionsSource: { kind: 'remote', loaderKey: 'families' },
  searchableInOptions: true,
}
```

Cambia `ui: 'input'` ↔ `'multi-select'` en dominio sin tocar el componente.

## Filter groups (panel superior, opcional)

En `tableConfig.filterGroups`:

- `field` — propiedad del DTO (ej. `familyId`, `categoryId`, `initial`, `idBucket`)
- `optionsSource.kind: 'static' | 'remote'` — `remote` usa `loaderKey`: `families` | `categories`
- Server: query en URL (`familyIds`, `categoryIds`, `initials`, `idBuckets`) y API `/admin/catalog/.../paged`
- Panel colapsable + chips activos + “Limpiar filtros” en `admin-table-filter-bar.tsx`

**Categorías:** grupo “Familias” (remote) + `quickSearch` por nombre (ej. “televisores”), sin inventar campos `groupId`.

**Familias:** “Inicial” (A–Z) + “Rango orden” (`idBucket` por `SortOrder`), sin `created_at` en API.

## Tipos y utilidades

- `src/shared/types/admin-table-config.ts`
- URL: `src/shared/lib/admin-table-url.ts`
- Hook: `src/features/admin/table/model/use-admin-table-query.ts`
