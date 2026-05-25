export function StockBadge({ available }: { available: number }) {
  if (available <= 0) return <span className="text-amber-400">Sin stock</span>;
  if (available < 5) return <span className="text-amber-300">Pocas unidades ({available})</span>;
  return <span className="text-emerald-400">En stock ({available})</span>;
}
