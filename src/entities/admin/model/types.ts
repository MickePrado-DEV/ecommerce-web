export interface FamilyAdminDto {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface CategoryAdminDto {
  id: string;
  familyId: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface SubcategoryAdminDto {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductAdminDto {
  id: string;
  subcategoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: number;
  isActive: boolean;
}

export interface VariantAdminDto {
  id: string;
  productId: string;
  sku: string;
  price?: number | null;
  isActive: boolean;
  quantityOnHand: number;
}

export interface CoverAdminDto {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface ShipmentSummaryDto {
  id: string;
  orderId: string;
  status: string;
  trackingNumber?: string | null;
  driverName?: string | null;
  createdAt: string;
}

export interface DriverAdminDto {
  id: string;
  name: string;
  phone: string;
  isActive: boolean;
}

export interface InventoryDto {
  variantId: string;
  sku: string;
  productName: string;
  quantityOnHand: number;
  quantityReserved: number;
  available: number;
}

export interface PagedProductsAdminDto {
  items: ProductAdminDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserAdminDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  isActive: boolean;
  roles: string[];
  createdAt: string;
}

export interface PagedUsersAdminDto {
  items: UserAdminDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductOptionDto {
  id: string;
  productId: string;
  name: string;
  optionType: number;
  sortOrder: number;
  values: OptionValueDto[];
}

export interface OptionValueDto {
  id: string;
  value: string;
  sortOrder: number;
}
