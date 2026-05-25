import { AdminSidebar } from '@/widgets/admin/sidebar/ui/admin-sidebar';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
