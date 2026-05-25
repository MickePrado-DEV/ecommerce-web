import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const src = join(import.meta.dirname, '..', 'src');

const replacements = [
  ['@/shared/lib/catalog-query-state', '@/shared/lib/catalog/query-state'],
  ['@/shared/lib/catalog-nav', '@/shared/lib/catalog/nav'],
  ['@/shared/lib/catalog-sort', '@/shared/lib/catalog/sort'],
  ['@/shared/hooks/use-catalog-query-state', '@/shared/hooks/catalog/use-query-state'],
  ["@/shared/hooks/use-query-state'", "@/shared/hooks/catalog'"],
  ['@/widgets/catalog-breadcrumb/', '@/widgets/catalog/breadcrumb/'],
  ['@/widgets/catalog-drawer/', '@/widgets/catalog/drawer/'],
  ['@/widgets/catalog-family-list/', '@/widgets/catalog/family-list/'],
  ['@/widgets/catalog-filters-panel/', '@/widgets/catalog/filters-panel/'],
  ['@/widgets/catalog-filters/', '@/widgets/catalog/filters/'],
  ['@/widgets/catalog-listing-shell/', '@/widgets/catalog/listing-shell/'],
  ['@/widgets/catalog-pagination/', '@/widgets/catalog/pagination/'],
  ['@/widgets/catalog-product-grid/', '@/widgets/catalog/product-grid/'],
  ['@/widgets/catalog-product-listing/', '@/widgets/catalog/product-listing/'],
  ['@/widgets/catalog-sort-select/', '@/widgets/catalog/sort-select/'],
  ['@/widgets/admin-layout/', '@/widgets/admin/layout/'],
  ['@/widgets/admin-route-guard/', '@/widgets/admin/route-guard/'],
  ['@/widgets/admin-sidebar/', '@/widgets/admin/sidebar/'],
  ['@/widgets/admin-stats-cards/', '@/widgets/admin/stats-cards/'],
  ['@/views/catalog-index/', '@/views/catalog/index/'],
  ['@/views/catalog-family/', '@/views/catalog/family/'],
  ['@/views/catalog-category/', '@/views/catalog/category/'],
  ['@/views/catalog-subcategory/', '@/views/catalog/subcategory/'],
  ['@/views/family-catalog/', '@/views/catalog/legacy/family/'],
  ['@/views/category-catalog/', '@/views/catalog/legacy/category/'],
  ['@/views/subcategory-catalog/', '@/views/catalog/legacy/subcategory/'],
  ["@/views/admin-dashboard'", "@/views/admin/dashboard'"],
  ["@/views/admin-dashboard/", '@/views/admin/dashboard/'],
  ['@/views/admin-inventory/', '@/views/admin/inventory/'],
  ['@/views/admin-order-detail/', '@/views/admin/order-detail/'],
  ["@/views/admin-orders'", "@/views/admin/orders'"],
  ["@/views/admin-orders/", '@/views/admin/orders/'],
  ['@/views/admin-products/', '@/views/admin/products/'],
  ['@/views/admin-product-form/', '@/views/admin/product-form/'],
  ['@/views/admin-product-options/', '@/views/admin/product-options/'],
  ['@/views/admin-product-variants/', '@/views/admin/product-variants/'],
  ['@/views/admin-families/', '@/views/admin/families/'],
  ['@/views/admin-family-form/', '@/views/admin/family-form/'],
  ['@/views/admin-categories/', '@/views/admin/categories/'],
  ['@/views/admin-category-form/', '@/views/admin/category-form/'],
  ['@/views/admin-subcategories/', '@/views/admin/subcategories/'],
  ['@/views/admin-subcategory-form/', '@/views/admin/subcategory-form/'],
  ['@/views/admin-covers/', '@/views/admin/covers/'],
  ['@/views/admin-cover-form/', '@/views/admin/cover-form/'],
  ['@/views/admin-drivers/', '@/views/admin/drivers/'],
  ['@/views/admin-driver-form/', '@/views/admin/driver-form/'],
  ['@/views/admin-shipments/', '@/views/admin/shipments/'],
  ['@/views/admin-shipment-form/', '@/views/admin/shipment-form/'],
  ['@/views/admin-options/', '@/views/admin/options/'],
  ['@/views/admin-users/', '@/views/admin/users/'],
  ['@/views/admin-user-form/', '@/views/admin/user-form/'],
];

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith('.ts') || p.endsWith('.tsx')) files.push(p);
  }
  return files;
}

let changed = 0;
for (const file of walk(src)) {
  let content = readFileSync(file, 'utf8');
  const orig = content;
  for (const [from, to] of replacements) content = content.split(from).join(to);
  if (content !== orig) {
    writeFileSync(file, content, 'utf8');
    changed++;
  }
}
console.log(`Updated ${changed} files`);
