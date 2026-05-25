import { StoreHeader } from '@/widgets/store-header/ui/store-header';

export function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHeader />
      <main className="container mx-auto min-h-[calc(100vh-4rem)] px-4 py-8">{children}</main>
      <footer className="border-t border-white/10 py-8 text-center text-sm text-zinc-500">
        Ecommerce · API .NET 10
      </footer>
    </>
  );
}
