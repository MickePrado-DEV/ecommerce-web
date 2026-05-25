import Link from 'next/link';

export function StoreFooter() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-sm text-zinc-500 md:flex-row">
        <p>Ecommerce · Frontend Next.js · API .NET 10</p>
        <nav className="flex gap-4">
          <Link href="/search" className="hover:text-violet-400">
            Buscar
          </Link>
          <Link href="/cart" className="hover:text-violet-400">
            Carrito
          </Link>
          <Link href="/login" className="hover:text-violet-400">
            Cuenta
          </Link>
        </nav>
      </div>
    </footer>
  );
}
