import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { AdminFamiliesPage } from '@/views/admin/families/ui/admin-families-page';
import { adminServerApi } from '@/shared/api/server-api';
import { parseAdminTableSearchParams } from '@/shared/lib/admin-table-url';
import { queryKeys } from '@/shared/lib/query-keys';
import { FAMILY_TABLE_CONFIG } from '@/entities/admin/config/family-table.config';
import { getDefaultPageSize } from '@/widgets/admin/data-table/lib/table-data';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const params = parseAdminTableSearchParams(
    sp,
    getDefaultPageSize(FAMILY_TABLE_CONFIG),
  );
  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: queryKeys.adminFamiliesTable(params),
    queryFn: () => adminServerApi.listFamiliesPaged(params),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <AdminFamiliesPage />
    </HydrationBoundary>
  );
}
