import { api, persistGuestTokenFromCart } from '@/shared/api/client';
import type { AddCartItemRequest, CartDto } from '../model/types';

export const cartApi = {
  get: async () => {
    const cart = await api<CartDto>('/cart', { guest: true });
    persistGuestTokenFromCart(cart);
    return cart;
  },

  addItem: async (body: AddCartItemRequest) => {
    const cart = await api<CartDto>('/cart/items', {
      method: 'POST',
      body: JSON.stringify(body),
      guest: true,
    });
    persistGuestTokenFromCart(cart);
    return cart;
  },

  updateItem: (itemId: string, quantity: number) =>
    api<CartDto>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
      guest: true,
    }),

  removeItem: (itemId: string) =>
    api<CartDto>(`/cart/items/${itemId}`, { method: 'DELETE', guest: true }),

  merge: (guestToken: string) =>
    api<CartDto>('/cart/merge', {
      method: 'POST',
      body: JSON.stringify({ guestToken }),
    }),
};
