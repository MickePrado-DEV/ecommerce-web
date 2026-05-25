import { api } from '@/shared/api/client';
import type {
  CreateProductReviewRequest,
  ProductReviewDto,
  ProductReviewsPageDto,
} from '../model/types';

export const reviewApi = {
  list: (slug: string) => api<ProductReviewsPageDto>(`/catalog/products/${slug}/reviews`, { auth: false }),
  create: (slug: string, body: CreateProductReviewRequest) =>
    api<ProductReviewDto>(`/catalog/products/${slug}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
};
