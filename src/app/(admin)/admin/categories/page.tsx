import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { AdminCategoriesPage } from '@/views/admin/categories/ui/admin-categories-page';
import { adminServerApi } from '@/shared/api/server-api';
import { parseAdminTableSearchParams } from '@/shared/lib/admin-table-url';
import { queryKeys } from '@/shared/lib/query-keys';
import { CATEGORY_TABLE_CONFIG } from '@/entities/admin/config/category-table.config';
import { getDefaultPageSize } from '@/widgets/admin/data-table/lib/table-data';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = parseAdminTableSearchParams(
    sp,
    getDefaultPageSize(CATEGORY_TABLE_CONFIG),
  );
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: queryKeys.adminCategoriesTable(params),
    queryFn: () => adminServerApi.listCategoriesPaged(params),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <AdminCategoriesPage />
    </HydrationBoundary>
  );
}
