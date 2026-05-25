import { AdminLayout } from '@/widgets/admin/layout/ui/admin-layout';
import { AdminRouteGuard } from '@/widgets/admin/route-guard/ui/admin-route-guard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRouteGuard>
      <AdminLayout>{children}</AdminLayout>
    </AdminRouteGuard>
  );
}
