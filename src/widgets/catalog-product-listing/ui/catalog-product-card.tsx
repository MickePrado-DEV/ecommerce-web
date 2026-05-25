import Link from 'next/link';
import Image from 'next/image';
import { formatMoney } from '@/shared/lib/format-money';
import type { ProductListItemDto } from '@/entities/catalog/model/types';
import { Button } from '@/shared/ui/button';

export function CatalogProductCard({ product }: { product: ProductListItemDto }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900/80 transition hover:border-purple-500/40">
      <div className="relative aspect-[4/3] bg-gray-950">
        {product.primaryImage ? (
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-600">
            Sin imagen
          </div>
        )}
        <span className="absolute left-3 top-3 rounded bg-purple-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Nuevo
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-white">{product.name}</h3>
        <p className="mt-2 text-lg font-bold text-purple-400">{formatMoney(product.price)}</p>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-4 w-full border-gray-700 hover:border-purple-500 hover:bg-gray-800"
        >
          <Link href={`/products/${product.slug}`}>Ver detalles</Link>
        </Button>
      </div>
    </article>
  );
}
