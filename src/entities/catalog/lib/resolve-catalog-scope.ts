import { catalogApi } from '@/entities/catalog/api/catalog-api';
import type { CategoryDetailDto, FamilyDto, SubcategoryDetailDto } from '@/entities/catalog/model/types';

export type CatalogScope = {
  familyId?: string;
  categoryId?: string;
  subCategoryId?: string;
};

async function findFamilyById(familyId: string): Promise<FamilyDto | undefined> {
  const families = await catalogApi.getFamilies();
  return families.find((f) => f.id === familyId);
}

export async function resolveFamilyScope(familySlug: string) {
  const family = await catalogApi.getFamily(familySlug);
  return {
    family,
    scope: { familyId: family.id } satisfies CatalogScope,
  };
}

export async function resolveCategoryScope(familySlug: string, categorySlug: string) {
  const [family, category] = await Promise.all([
    catalogApi.getFamily(familySlug),
    catalogApi.getCategory(categorySlug),
  ]);
  if (category.familyId !== family.id) {
    throw new Error('Category does not belong to this family');
  }
  return {
    family,
    category,
    scope: { familyId: family.id, categoryId: category.id } satisfies CatalogScope,
  };
}

export async function resolveSubcategoryScope(
  familySlug: string,
  categorySlug: string,
  subCategorySlug: string,
) {
  const { family, category, scope: catScope } = await resolveCategoryScope(familySlug, categorySlug);
  const sub = await catalogApi.getSubcategory(subCategorySlug);
  if (sub.categoryId !== category.id) {
    throw new Error('Subcategory does not belong to this category');
  }
  return {
    family,
    category,
    subcategory: sub,
    scope: { ...catScope, subCategoryId: sub.id } satisfies CatalogScope,
  };
}

export async function buildRedirectForCategorySlug(categorySlug: string): Promise<string | null> {
  const category = await catalogApi.getCategory(categorySlug);
  const family = await findFamilyById(category.familyId);
  if (!family) return null;
  return `/catalog/${family.slug}/${category.slug}`;
}

export async function buildRedirectForSubcategorySlug(subCategorySlug: string): Promise<string | null> {
  const sub = await catalogApi.getSubcategory(subCategorySlug);
  const families = await catalogApi.getFamilies();
  for (const family of families) {
    for (const cat of family.categories) {
      if (cat.id !== sub.categoryId) continue;
      const match = cat.subcategories.find((s) => s.id === sub.id);
      if (match) return `/catalog/${family.slug}/${cat.slug}/${match.slug}`;
    }
  }
  return null;
}

export type ResolvedCatalogPage =
  | { level: 'family'; family: FamilyDto; scope: CatalogScope }
  | { level: 'category'; family: FamilyDto; category: CategoryDetailDto; scope: CatalogScope }
  | {
      level: 'subcategory';
      family: FamilyDto;
      category: CategoryDetailDto;
      subcategory: SubcategoryDetailDto;
      scope: CatalogScope;
    };
