'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/entities/admin/api/admin-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { PageHeader } from '@/shared/ui/page-header';
import { AdminStatsCards } from '@/widgets/admin-stats-cards/ui/admin-stats-cards';

export function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.adminDashboard,
    queryFn: adminApi.dashboard,
  });

  if (isLoading) return <p>Cargando…</p>;

  return (
    <div>
      <PageHeader title="Dashboard" />
      <AdminStatsCards data={data} />
    </div>
  );
}
