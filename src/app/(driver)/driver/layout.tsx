import { DriverLayout } from '@/widgets/driver-layout/ui/driver-layout';
import { DriverRouteGuard } from '@/widgets/driver-route-guard/ui/driver-route-guard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DriverRouteGuard>
      <DriverLayout>{children}</DriverLayout>
    </DriverRouteGuard>
  );
}
