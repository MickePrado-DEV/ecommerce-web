import { api } from '@/shared/api/client';
import type {
  CheckoutRequest,
  CheckoutResultDto,
  OrderDetailDto,
  OrderTrackingDto,
  PagedOrdersDto,
  PaymentResultDto,
} from '../model/types';

export const orderApi = {
  checkout: (body: CheckoutRequest) =>
    api<CheckoutResultDto>('/checkout', { method: 'POST', body: JSON.stringify(body) }),

  list: (page = 1, pageSize = 20, status?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (status) q.set('status', status);
    return api<PagedOrdersDto>(`/orders?${q}`);
  },

  get: (id: string) => api<OrderDetailDto>(`/orders/${id}`),

  tracking: (id: string) => api<OrderTrackingDto>(`/orders/${id}/tracking`),

  pay: (id: string) => api<PaymentResultDto>(`/orders/${id}/pay`, { method: 'POST' }),

  cancel: (id: string) => api<void>(`/orders/${id}/cancel`, { method: 'POST' }),
};
