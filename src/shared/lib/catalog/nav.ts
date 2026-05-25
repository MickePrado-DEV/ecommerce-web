import type { FamilyDto } from '@/entities/catalog/model/types';

export type CatalogPreview = {
  familyId: string;
  familyName: string;
  familySlug: string;
  categories: {
    id: string;
    name: string;
    slug: string;
    subCategories: { id: string; name: string; slug: string }[];
  }[];
};

export function getCatalogByFamily(families: FamilyDto[], familyId: string | null): CatalogPreview | null {
  if (!familyId) return null;
  const family = families.find((f) => f.id === familyId);
  if (!family) return null;
  return {
    familyId: family.id,
    familyName: family.name,
    familySlug: family.slug,
    categories: family.categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      subCategories: c.subcategories.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
      })),
    })),
  };
}

export function getDefaultFamilyId(families: FamilyDto[]): string | null {
  return families[0]?.id ?? null;
}
