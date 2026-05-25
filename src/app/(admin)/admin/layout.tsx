import { AdminLayout } from '@/widgets/admin-layout/ui/admin-layout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
