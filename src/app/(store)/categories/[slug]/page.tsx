import { redirect, notFound } from 'next/navigation';
import { buildRedirectForCategorySlug } from '@/entities/catalog/lib/resolve-catalog-scope';

export default async function LegacyCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const target = await buildRedirectForCategorySlug(slug);
  if (!target) notFound();
  redirect(target);
}
