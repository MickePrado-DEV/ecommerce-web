import { api } from '@/shared/api/client';
import type {
  CreateProductReviewRequest,
  ProductReviewDto,
  ProductReviewEligibilityDto,
  ProductReviewsPageDto,
} from '../model/types';

export const reviewApi = {
  list: (slug: string) => api<ProductReviewsPageDto>(`/catalog/products/${slug}/reviews`, { auth: false }),
  eligibility: (slug: string) =>
    api<ProductReviewEligibilityDto>(`/catalog/products/${slug}/reviews/eligibility`),
  create: (slug: string, body: CreateProductReviewRequest) =>
    api<ProductReviewDto>(`/catalog/products/${slug}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
};
