import { getOrderStatusLabel, getOrderStatusVariant } from '@/shared/lib/order-status';
import { cn } from '@/shared/lib/utils';

const styles = {
  default: 'bg-violet-600/20 text-violet-300',
  warning: 'bg-amber-600/20 text-amber-300',
  success: 'bg-emerald-600/20 text-emerald-300',
  muted: 'bg-zinc-600/30 text-zinc-400',
};

export function OrderStatusBadge({ status }: { status: string }) {
  const variant = getOrderStatusVariant(status);
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', styles[variant])}>
      {getOrderStatusLabel(status)}
    </span>
  );
}
