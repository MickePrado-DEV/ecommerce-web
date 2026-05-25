export interface SubcategoryDto {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  subcategories: SubcategoryDto[];
}

export interface FamilyDto {
  id: string;
  name: string;
  slug: string;
  categories: CategoryDto[];
}

export interface CategoryDetailDto {
  id: string;
  familyId: string;
  name: string;
  slug: string;
  subcategories: SubcategoryDto[];
}

export interface SubcategoryDetailDto {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
}

export interface CoverDto {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  sortOrder: number;
}

export interface ProductListItemDto {
  id: string;
  name: string;
  slug: string;
  price: number;
  primaryImage?: string | null;
}

export interface CatalogHomeDto {
  covers: CoverDto[];
  latestProducts: ProductListItemDto[];
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

export type PagedProducts = PagedResult<ProductListItemDto>;
