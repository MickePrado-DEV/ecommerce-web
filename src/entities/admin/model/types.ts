export interface PagedAdminResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FamilyAdminDto {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export type PagedFamiliesAdminDto = PagedAdminResult<FamilyAdminDto>;

export interface CategoryAdminRowDto {
  id: string;
  familyId: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  familyName: string;
}

export type PagedCategoriesAdminDto = PagedAdminResult<CategoryAdminRowDto>;

export interface SubcategoryAdminRowDto {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  categoryName: string;
  familyName: string;
}

export type PagedSubcategoriesAdminDto = PagedAdminResult<SubcategoryAdminRowDto>;

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
  startsAt?: string | null;
  endsAt?: string | null;
  isEffectivelyActive: boolean;
}

export interface PagedCoversAdminDto {
  items: CoverAdminDto[];
  total: number;
  page: number;
  pageSize: number;
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
