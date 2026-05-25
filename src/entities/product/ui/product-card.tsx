import Link from 'next/link';
import Image from 'next/image';
import { formatMoney } from '@/shared/lib/format-money';
import type { ProductListItemDto } from '@/entities/catalog/model/types';

export function ProductCard({ product }: { product: ProductListItemDto }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-violet-500/50"
    >
      <div className="relative aspect-square bg-zinc-900">
        {product.primaryImage ? (
          <Image src={product.primaryImage} alt={product.name} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">Sin imagen</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium group-hover:text-violet-400">{product.name}</h3>
        <p className="mt-1 text-violet-400">{formatMoney(product.price)}</p>
      </div>
    </Link>
  );
}
