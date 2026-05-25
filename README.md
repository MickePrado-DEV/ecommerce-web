# ecommerce-web

Frontend **Next.js 16** + TypeScript + **Feature-Sliced Design** para el API Ecommerce (.NET 10).

## Requisitos

- Node.js 20+
- API en ejecución: `http://localhost:5088/api/v1`

## Configuración

```powershell
cp .env.example .env.local
npm install
```

## Desarrollo

```powershell
npm run dev
```

Si en Windows aparece `EPERM` al renombrar archivos en `.next` (varias instancias de `next dev` o antivirus bloqueando la carpeta):

```powershell
# Cierra otros `npm run dev`, luego:
npm run dev:clean
```

Eso borra `.next` y arranca de nuevo.

## Scripts útiles

| Comando | Descripción |
|---------|-------------|
| `npm run dev:clean` | Limpia caché `.next` y arranca dev |
| `npm run clean` | Solo elimina `.next` |
| `npm run generate:barrels` | Regenera `index.ts` FSD en entities/features/widgets/views |

## Proxy (auth de rutas)

Next.js 16 usa `src/proxy.ts` (antes `middleware.ts`) para redirigir a `/login` si no hay cookie `accessToken`.

Abre [http://localhost:3000](http://localhost:3000)

## Producción

```powershell
npm run build
npm start
```

## Usuarios demo (API)

| Rol | Email | Contraseña |
|-----|-------|------------|
| Cliente | cliente@ecommerce.local | Cliente123! |
| Admin | admin@ecommerce.local | Admin123! |
| Repartidor | repartidor@ecommerce.local | Repartidor123! |

Cupón demo: `WELCOME10`

## Estructura FSD

```
src/
  app/       → routing Next.js (re-exports)
  views/     → pantallas (capa pages FSD; no usar src/pages/)
    catalog/ → index, family, category, subcategory…
    admin/   → dashboard, products, orders…
  widgets/   → bloques UI compuestos
    catalog/ → breadcrumb, filters-panel, product-listing…
    admin/   → layout, sidebar, route-guard…
  features/  → acciones de usuario
  entities/  → dominio + API (catalog/, admin/)
  shared/    → UI, cliente HTTP, utilidades
    lib/catalog/   → query-state, nav, sort
    hooks/catalog/ → use-query-state
```

## Rutas

Tienda, cuenta, checkout, admin CRUD, panel repartidor — ver `C:\Udemy\Next\README.md` o la documentación del API en `ecommerce-api/docs/`.

## Documentación

- [Guía completa frontend](file:///C:/Udemy/.net/Ecommerce/ecommerce-api/docs/10-frontend-nextjs-fsd-completo.md)
- [Inventario de archivos](file:///C:/Udemy/.net/Ecommerce/ecommerce-api/docs/INVENTARIO-FRONTEND-ARCHIVOS.md)
