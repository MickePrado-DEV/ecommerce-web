import { redirect, notFound } from 'next/navigation';
import { buildRedirectForSubcategorySlug } from '@/entities/catalog/lib/resolve-catalog-scope';

export default async function LegacySubcategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const target = await buildRedirectForSubcategorySlug(slug);
  if (!target) notFound();
  redirect(target);
}
