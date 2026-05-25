import { api } from '@/shared/api/client';

export interface WishlistItemDto {
  productId: string;
  name: string;
  slug: string;
  price: number;
  primaryImage?: string | null;
  addedAt: string;
}

export const wishlistApi = {
  list: () => api<WishlistItemDto[]>('/wishlist'),
  add: (productId: string) => api<void>(`/wishlist/${productId}`, { method: 'POST' }),
  remove: (productId: string) => api<void>(`/wishlist/${productId}`, { method: 'DELETE' }),
};
