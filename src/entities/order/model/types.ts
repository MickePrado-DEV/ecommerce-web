export interface OrderSummaryDto {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

export interface OrderItemDto {
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderAddressDto {
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface PaymentInfoDto {
  status: string;
  amount: number;
  paidAt?: string | null;
}

export interface OrderShipmentInfoDto {
  shipmentId: string;
  status: string;
  trackingNumber?: string | null;
  driverName?: string | null;
  shippedAt?: string | null;
}

export interface OrderDetailDto {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
  items: OrderItemDto[];
  address?: OrderAddressDto | null;
  payment?: PaymentInfoDto | null;
  shipment?: OrderShipmentInfoDto | null;
}

export interface CheckoutRequest {
  addressId?: string;
  fullName?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  shippingCost: number;
  couponCode?: string;
}

export interface CheckoutResultDto {
  orderId: string;
  orderNumber: string;
  subtotal: number;
  discountAmount: number;
  couponCode?: string | null;
  total: number;
  status: string;
}

export interface PaymentResultDto {
  orderId: string;
  status: string;
  reference?: string | null;
}

export interface PagedOrdersDto {
  items: OrderSummaryDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface OrderTrackingDto {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  shipment?: OrderShipmentInfoDto | null;
}
