export interface WishlistItemDto {
  productId: string;
  name: string;
  slug: string;
  price: number;
  primaryImage?: string | null;
  addedAt: string;
}
