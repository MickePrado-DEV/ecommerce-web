import { StoreHeader } from '@/widgets/store-header/ui/store-header';
import { StoreFooter } from '@/widgets/store-footer/ui/store-footer';

export function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHeader />
      <main className="container mx-auto min-h-[calc(100vh-8rem)] px-4 py-8">{children}</main>
      <StoreFooter />
    </>
  );
}
