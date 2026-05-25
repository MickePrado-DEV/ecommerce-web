import { formatMoney } from '@/shared/lib/format-money';
import { cn } from '@/shared/lib/utils';

export function PriceTag({ amount, className }: { amount: number; className?: string }) {
  return <span className={cn('font-semibold text-violet-400', className)}>{formatMoney(amount)}</span>;
}
