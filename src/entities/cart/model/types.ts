export interface CartItemDto {
  id: string;
  variantId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CartDto {
  id: string;
  guestToken?: string | null;
  items: CartItemDto[];
  subtotal: number;
}

export interface AddCartItemRequest {
  variantId: string;
  quantity: number;
}
