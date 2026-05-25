import type { LucideIcon } from 'lucide-react';
import {
  Gauge,
  Images,
  PackageOpen,
  Tag,
  Tags,
  Contact,
  Receipt,
  Truck,
  Settings,
  Package,
  Warehouse,
  Users,
} from 'lucide-react';

export interface AdminNavLink {
  href: string;
  label: string;
  permission: string;
  icon: LucideIcon;
  /** Patrón de ruta activa (prefijo) */
  activePrefix?: string;
}

export interface AdminNavSection {
  title: string | null;
  links: AdminNavLink[];
}

export const adminNavSections: AdminNavSection[] = [
  {
    title: null,
    links: [
      {
        href: '/admin/dashboard',
        label: 'Dashboard',
        permission: 'admin.dashboard.view',
        icon: Gauge,
      },
    ],
  },
  {
    title: 'Administrar página',
    links: [
      { href: '/admin/covers', label: 'Portadas', permission: 'admin.covers.view', icon: Images, activePrefix: '/admin/covers' },
      { href: '/admin/families', label: 'Familias', permission: 'admin.families.view', icon: PackageOpen, activePrefix: '/admin/families' },
      { href: '/admin/categories', label: 'Categorías', permission: 'admin.categories.view', icon: Tag, activePrefix: '/admin/categories' },
      { href: '/admin/subcategories', label: 'Subcategorías', permission: 'admin.subcategories.view', icon: Tags, activePrefix: '/admin/subcategories' },
    ],
  },
  {
    title: 'Órdenes y envíos',
    links: [
      { href: '/admin/drivers', label: 'Conductores', permission: 'admin.drivers.view', icon: Contact, activePrefix: '/admin/drivers' },
      { href: '/admin/orders', label: 'Pedidos', permission: 'admin.orders.view', icon: Receipt, activePrefix: '/admin/orders' },
      { href: '/admin/shipments', label: 'Envíos', permission: 'admin.shipments.view', icon: Truck, activePrefix: '/admin/shipments' },
    ],
  },
  {
    title: 'Administrar stock',
    links: [
      { href: '/admin/options', label: 'Opciones', permission: 'admin.options.view', icon: Settings, activePrefix: '/admin/options' },
      { href: '/admin/products', label: 'Productos', permission: 'admin.products.view', icon: Package, activePrefix: '/admin/products' },
      { href: '/admin/inventory', label: 'Inventario', permission: 'admin.stock.view', icon: Warehouse, activePrefix: '/admin/inventory' },
    ],
  },
  {
    title: 'Usuarios',
    links: [
      { href: '/admin/users', label: 'Usuarios', permission: 'admin.users.view', icon: Users, activePrefix: '/admin/users' },
    ],
  },
];

export const adminNavItems = adminNavSections.flatMap((s) => s.links);

export function canAccessAdminPanel(permissions: string[]): boolean {
  return permissions.some((p) => p.startsWith('admin.'));
}

export function permissionForAdminPath(pathname: string): string | null {
  if (pathname === '/admin') return 'admin.dashboard.view';
  const item = adminNavItems.find(
    (n) => pathname === n.href || pathname.startsWith(`${n.activePrefix ?? n.href}/`),
  );
  return item?.permission ?? null;
}

export function isNavLinkActive(pathname: string, link: AdminNavLink): boolean {
  const prefix = link.activePrefix ?? link.href;
  return pathname === link.href || pathname.startsWith(`${prefix}/`);
}
