export interface AdminNavItem {
  href: string;
  label: string;
  permission: string;
}

export const adminNavItems: AdminNavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', permission: 'admin.dashboard.view' },
  { href: '/admin/covers', label: 'Portadas', permission: 'admin.covers.view' },
  { href: '/admin/families', label: 'Familias', permission: 'admin.families.view' },
  { href: '/admin/categories', label: 'Categorías', permission: 'admin.categories.view' },
  { href: '/admin/subcategories', label: 'Subcategorías', permission: 'admin.subcategories.view' },
  { href: '/admin/products', label: 'Productos', permission: 'admin.products.view' },
  { href: '/admin/inventory', label: 'Inventario', permission: 'admin.stock.view' },
  { href: '/admin/orders', label: 'Pedidos', permission: 'admin.orders.view' },
  { href: '/admin/shipments', label: 'Envíos', permission: 'admin.shipments.view' },
  { href: '/admin/drivers', label: 'Repartidores', permission: 'admin.drivers.view' },
];

/** Permiso mínimo para entrar al panel (cualquier permiso admin.*) */
export function canAccessAdminPanel(permissions: string[]): boolean {
  return permissions.some((p) => p.startsWith('admin.'));
}

export function permissionForAdminPath(pathname: string): string | null {
  if (pathname === '/admin') return 'admin.dashboard.view';
  const item = adminNavItems.find(
    (n) => pathname === n.href || pathname.startsWith(`${n.href}/`),
  );
  return item?.permission ?? null;
}
