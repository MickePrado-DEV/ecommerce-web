import { api } from '@/shared/api/client';
import type { ResolvedVariantDto } from '@/entities/product/model/types';
import type { ProductDetailDto } from '@/entities/product/model/types';
import type {
  CatalogHomeDto,
  CatalogOptionDto,
  CategoryDetailDto,
  CoverDto,
  FamilyDto,
  PagedProducts,
  SubcategoryDetailDto,
} from '../model/types';

export const catalogApi = {
  getHome: (take = 12) => api<CatalogHomeDto>(`/catalog/home?take=${take}`, { auth: false }),

  getFamilies: () => api<FamilyDto[]>('/catalog/families', { auth: false }),

  getFamily: (slug: string) => api<FamilyDto>(`/catalog/families/${slug}`, { auth: false }),

  getCategory: (slug: string) =>
    api<CategoryDetailDto>(`/catalog/categories/${slug}`, { auth: false }),

  getSubcategory: (slug: string) =>
    api<SubcategoryDetailDto>(`/catalog/subcategories/${slug}`, { auth: false }),

  getProducts: (params: URLSearchParams) =>
    api<PagedProducts>(`/catalog/products?${params}`, { auth: false }),

  getFilterOptions: (scope: { familyId?: string; categoryId?: string; subCategoryId?: string }) => {
    const q = new URLSearchParams();
    if (scope.familyId) q.set('familyId', scope.familyId);
    if (scope.categoryId) q.set('categoryId', scope.categoryId);
    if (scope.subCategoryId) q.set('subCategoryId', scope.subCategoryId);
    const qs = q.toString();
    return api<CatalogOptionDto[]>(`/catalog/products/filter-options${qs ? `?${qs}` : ''}`, {
      auth: false,
    });
  },

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
