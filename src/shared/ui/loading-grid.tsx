import { Skeleton } from '@/shared/ui/skeleton';

export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-[4/5] w-full rounded-lg" />
      ))}
    </div>
  );
}
