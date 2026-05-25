import Link from 'next/link';

export function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/driver/shipments" className="font-bold text-violet-400">
            Repartidor
          </Link>
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            Tienda
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
