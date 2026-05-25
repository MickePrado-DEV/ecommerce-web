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
  widgets/   → bloques UI compuestos
  features/  → acciones de usuario
  entities/  → dominio + API
  shared/    → UI, cliente HTTP, utilidades
```

## Rutas

Tienda, cuenta, checkout, admin CRUD, panel repartidor — ver `C:\Udemy\Next\README.md` o la documentación del API en `ecommerce-api/docs/`.

## Documentación

- [Guía completa frontend](file:///C:/Udemy/.net/Ecommerce/ecommerce-api/docs/10-frontend-nextjs-fsd-completo.md)
- [Inventario de archivos](file:///C:/Udemy/.net/Ecommerce/ecommerce-api/docs/INVENTARIO-FRONTEND-ARCHIVOS.md)
