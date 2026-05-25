import { api } from '@/shared/api/client';
import type { WishlistItemDto } from '../model/types';

export const wishlistApi = {
  list: () => api<WishlistItemDto[]>('/wishlist'),
  add: (productId: string) => api<void>(`/wishlist/${productId}`, { method: 'POST' }),
  remove: (productId: string) => api<void>(`/wishlist/${productId}`, { method: 'DELETE' }),
};
