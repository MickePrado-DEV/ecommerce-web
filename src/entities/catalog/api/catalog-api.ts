import { api } from '@/shared/api/client';
import type { ResolvedVariantDto } from '@/entities/product/model/types';
import type { ProductDetailDto } from '@/entities/product/model/types';
import type {
  CatalogHomeDto,
  CoverDto,
  FamilyDto,
  PagedProducts,
} from '../model/types';

export const catalogApi = {
  getHome: (take = 12) => api<CatalogHomeDto>(`/catalog/home?take=${take}`, { auth: false }),

  getFamilies: () => api<FamilyDto[]>('/catalog/families', { auth: false }),

  getFamily: (slug: string) => api<FamilyDto>(`/catalog/families/${slug}`, { auth: false }),

  getCategory: (slug: string) =>
    api<import('../model/types').CategoryDetailDto>(`/catalog/categories/${slug}`, { auth: false }),

  getSubcategory: (slug: string) =>
    api<import('../model/types').SubcategoryDetailDto>(`/catalog/subcategories/${slug}`, { auth: false }),

  getProducts: (params: URLSearchParams) =>
    api<PagedProducts>(`/catalog/products?${params}`, { auth: false }),

  search: (q: string, page = 1, pageSize = 20) =>
    api<PagedProducts>(
      `/catalog/search?q=${encodeURIComponent(q)}&page=${page}&pageSize=${pageSize}`,
      { auth: false },
    ),

  getProduct: (slug: string) => api<ProductDetailDto>(`/catalog/products/${slug}`, { auth: false }),

  resolveVariant: (slug: string, optionValueIds: string[]) =>
    api<ResolvedVariantDto>(`/catalog/products/${slug}/resolve-variant`, {
      method: 'POST',
      body: JSON.stringify({ optionValueIds }),
      auth: false,
    }),
};
