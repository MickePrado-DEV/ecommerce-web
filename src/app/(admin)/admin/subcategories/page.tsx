import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { AdminSubcategoriesPage } from '@/views/admin/subcategories/ui/admin-subcategories-page';
import { adminServerApi } from '@/shared/api/server-api';
import { parseAdminTableSearchParams } from '@/shared/lib/admin-table-url';
import { queryKeys } from '@/shared/lib/query-keys';
import { SUBCATEGORY_TABLE_CONFIG } from '@/domain/subcategories/subcategory.table';
import { getDefaultPageSize } from '@/widgets/admin/data-table/lib/table-data';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = parseAdminTableSearchParams(
    sp,
    getDefaultPageSize(SUBCATEGORY_TABLE_CONFIG),
  );
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: queryKeys.adminSubcategoriesTable(params),
    queryFn: () => adminServerApi.listSubcategoriesPaged(params),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <AdminSubcategoriesPage />
    </HydrationBoundary>
  );
}
