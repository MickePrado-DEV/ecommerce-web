'use client';

import { useMutation } from '@tanstack/react-query';
import { wishlistApi } from '@/entities/wishlist/api/wishlist-api';
import { useAuthStore } from '@/entities/user/model/auth-store';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export function WishlistButton({ productId, slug }: { productId: string; slug: string }) {
  const user = useAuthStore((s) => s.user);
  const add = useMutation({
    mutationFn: () => wishlistApi.add(productId),
    onSuccess: () => toast.success('Agregado a favoritos'),
    onError: (e: Error) => toast.error(e.message),
  });

  if (!user) {
    return (
      <Button variant="outline" asChild>
        <Link href={`/login?redirect=/products/${slug}`}>
          <Heart className="mr-2 h-4 w-4" /> Favoritos
        </Link>
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={() => add.mutate()} disabled={add.isPending}>
      <Heart className="mr-2 h-4 w-4" /> Favoritos
    </Button>
  );
}
