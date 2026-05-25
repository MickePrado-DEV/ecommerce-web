import { api } from '@/shared/api/client';
import type { AddressDto, SaveAddressRequest } from '../model/types';

export const addressApi = {
  list: () => api<AddressDto[]>('/addresses'),
  get: (id: string) => api<AddressDto>(`/addresses/${id}`),
  create: (body: SaveAddressRequest) =>
    api<AddressDto>('/addresses', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: SaveAddressRequest) =>
    api<AddressDto>(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id: string) => api<void>(`/addresses/${id}`, { method: 'DELETE' }),
  setDefault: (id: string) => api<void>(`/addresses/${id}/default`, { method: 'PATCH' }),
};
