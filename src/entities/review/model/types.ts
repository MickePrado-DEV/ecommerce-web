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

export interface CreateProductReviewRequest {
  rating: number;
  title?: string;
  comment: string;
}
