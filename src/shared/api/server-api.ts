import { cookies } from 'next/headers';
import { env } from '@/shared/config/env';
import type { AdminTableQueryParams } from '@/shared/lib/admin-table-url';
import { adminTableParamsToQueryString } from '@/shared/lib/admin-table-url';
import type {
  CategoryAdminRowDto,
  FamilyAdminDto,
  PagedCategoriesAdminDto,
  PagedFamiliesAdminDto,
  PagedSubcategoriesAdminDto,
  SubcategoryAdminRowDto,
} from '@/entities/admin/model/types';

async function serverFetch<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${env.apiUrl}${path}`, { headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const adminServerApi = {
  listFamiliesPaged: (params: AdminTableQueryParams) =>
    serverFetch<PagedFamiliesAdminDto>(`/admin/catalog/families/paged?${adminTableParamsToQueryString(params)}`),

  listCategoriesPaged: (params: AdminTableQueryParams) =>
    serverFetch<PagedCategoriesAdminDto>(`/admin/catalog/categories/paged?${adminTableParamsToQueryString(params)}`),

  listSubcategoriesPaged: (params: AdminTableQueryParams) =>
    serverFetch<PagedSubcategoriesAdminDto>(`/admin/catalog/subcategories/paged?${adminTableParamsToQueryString(params)}`),
};
