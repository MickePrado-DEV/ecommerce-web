export interface CatalogOptionValueDto {
  id: string;
  value: string;
  sortOrder: number;
}

export interface CatalogOptionDto {
  id: string;
  name: string;
  sortOrder: number;
  values: CatalogOptionValueDto[];
}

export interface ProductVariantDto {
  id: string;
  sku: string;
  price: number;
  available: number;
  optionValueIds: string[];
}

export interface ProductDetailDto {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  basePrice: number;
  options: CatalogOptionDto[];
  variants: ProductVariantDto[];
  images: string[];
}

export interface ResolvedVariantDto {
  variantId: string;
  sku: string;
  price: number;
  available: number;
  optionValueIds: string[];
}
