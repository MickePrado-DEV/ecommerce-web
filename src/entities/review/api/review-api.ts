import { api } from '@/shared/api/client';

export interface ProductReviewDto {
  id: string;
  authorName: string;
  rating: number;
  title?: string | null;
  comment: string;
  createdAt: string;
}

export interface ProductReviewSummaryDto {
  averageRating: number;
  totalCount: number;
}

export interface ProductReviewsPageDto {
  summary: ProductReviewSummaryDto;
  items: ProductReviewDto[];
}

export const reviewApi = {
  list: (slug: string) => api<ProductReviewsPageDto>(`/catalog/products/${slug}/reviews`, { auth: false }),
  create: (slug: string, body: { rating: number; title?: string; comment: string }) =>
    api<ProductReviewDto>(`/catalog/products/${slug}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
};
