# AdminDataTable

Tabla reutilizable del panel admin. **Toda la definición de columnas y comportamiento vive en la config del modelo/DTO**, no en la página.

## Uso en una pantalla nueva

1. Crea `src/entities/admin/config/mi-entidad-table.config.ts` con `AdminTableConfig<MiDto>`.
2. En la página:

```tsx
import { AdminDataTable } from '@/widgets/admin/data-table/ui/admin-data-table';
import { MI_TABLA_CONFIG } from '@/entities/admin/config/mi-entidad-table.config';

<AdminDataTable
  data={rows}
  tableConfig={MI_TABLA_CONFIG}
  loading={isLoading}
  onRowAction={(actionId, row) => {
    if (actionId === 'delete') del.mutate(row.id);
  }}
/>
```

## Configs existentes

| Entidad        | Archivo                                      |
|----------------|----------------------------------------------|
| Familias       | `entities/admin/config/family-table.config.ts` |
| Categorías     | `entities/admin/config/category-table.config.ts` |
| Subcategorías  | `entities/admin/config/subcategory-table.config.ts` |

## Props principales

- `data` — filas
- `tableConfig` — columnas, sort, filtros, frozen, paginado, acciones
- `loading` — skeleton
- `onRowAction` — botones sin `href` (p. ej. eliminar)
- `paging` / `onSort` / `onFilterChange` / `onPageChange` — obligatorios en modo `server` (usa `useAdminTableQuery`)
- Estado en URL (`?page=&sortKey=&search=`) + caché React Query 5 min (`staleTime`)
- SSR: prefetch en `app/(admin)/admin/.../page.tsx` con `HydrationBoundary`
- Paginación siempre visible abajo si `pagination.enabled`
- Acciones con `icon: 'edit' | 'delete'` (solo íconos)

Tipos: `src/shared/types/admin-table-config.ts`
