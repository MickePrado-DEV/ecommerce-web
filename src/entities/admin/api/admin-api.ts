import { env } from '@/shared/config/env';
import { api } from '@/shared/api/client';
import type { OrderDetailDto, PagedOrdersDto } from '@/entities/order/model/types';
import type {
  CategoryAdminDto,
  CoverAdminDto,
  DriverAdminDto,
  FamilyAdminDto,
  PagedUsersAdminDto,
  UserAdminDto,
  InventoryDto,
  PagedProductsAdminDto,
  ProductAdminDto,
  ProductOptionDto,
  ShipmentSummaryDto,
  SubcategoryAdminDto,
  VariantAdminDto,
} from '../model/types';

export interface DashboardStatsDto {
  totalOrders: number;
  pendingPaymentOrders: number;
  paidOrders: number;
  readyToDispatchOrders: number;
  totalProducts: number;
  totalUsers: number;
}

export const adminApi = {
  dashboard: () => api<DashboardStatsDto>('/admin/dashboard'),

  // Covers
  listCovers: () => api<CoverAdminDto[]>('/admin/covers'),
  getCover: (id: string) => api<CoverAdminDto>(`/admin/covers/${id}`),
  saveCover: (body: unknown, id?: string) =>
    id
      ? api<CoverAdminDto>(`/admin/covers/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      : api<CoverAdminDto>('/admin/covers', { method: 'POST', body: JSON.stringify(body) }),
  deleteCover: (id: string) => api<void>(`/admin/covers/${id}`, { method: 'DELETE' }),
  reorderCovers: (ids: string[]) =>
    api<void>('/admin/covers/reorder', { method: 'PATCH', body: JSON.stringify({ ids }) }),

  // Catalog
  listFamilies: () => api<FamilyAdminDto[]>('/admin/catalog/families'),
  saveFamily: (body: unknown, id?: string) =>
    id
      ? api<FamilyAdminDto>(`/admin/catalog/families/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      : api<FamilyAdminDto>('/admin/catalog/families', { method: 'POST', body: JSON.stringify(body) }),
  deleteFamily: (id: string) => api<void>(`/admin/catalog/families/${id}`, { method: 'DELETE' }),

  saveCategory: (body: unknown, id?: string) =>
    id
      ? api<CategoryAdminDto>(`/admin/catalog/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      : api<CategoryAdminDto>('/admin/catalog/categories', { method: 'POST', body: JSON.stringify(body) }),
  deleteCategory: (id: string) => api<void>(`/admin/catalog/categories/${id}`, { method: 'DELETE' }),

  saveSubcategory: (body: unknown, id?: string) =>
    id
      ? api<SubcategoryAdminDto>(`/admin/catalog/subcategories/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      : api<SubcategoryAdminDto>('/admin/catalog/subcategories', { method: 'POST', body: JSON.stringify(body) }),
  deleteSubcategory: (id: string) => api<void>(`/admin/catalog/subcategories/${id}`, { method: 'DELETE' }),

  listProducts: (page = 1, pageSize = 20) =>
    api<PagedProductsAdminDto>(`/admin/catalog/products?page=${page}&pageSize=${pageSize}`),
  saveProduct: (body: unknown, id?: string) =>
    id
      ? api<ProductAdminDto>(`/admin/catalog/products/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      : api<ProductAdminDto>('/admin/catalog/products', { method: 'POST', body: JSON.stringify(body) }),
  deleteProduct: (id: string) => api<void>(`/admin/catalog/products/${id}`, { method: 'DELETE' }),

  saveVariant: (body: unknown, id?: string) =>
    id
      ? api<VariantAdminDto>(`/admin/catalog/variants/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      : api<VariantAdminDto>('/admin/catalog/variants', { method: 'POST', body: JSON.stringify(body) }),
  deleteVariant: (id: string) => api<void>(`/admin/catalog/variants/${id}`, { method: 'DELETE' }),

  listProductOptions: (productId: string) =>
    api<ProductOptionDto[]>(`/admin/products/${productId}/options`),
  saveProductOption: (productId: string, body: unknown, optionId?: string) =>
    optionId
      ? api<ProductOptionDto>(`/admin/products/${productId}/options/${optionId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
      : api<ProductOptionDto>(`/admin/products/${productId}/options`, {
          method: 'POST',
          body: JSON.stringify(body),
        }),
  deleteProductOption: (productId: string, optionId: string) =>
    api<void>(`/admin/products/${productId}/options/${optionId}`, { method: 'DELETE' }),
  saveOptionValue: (productId: string, optionId: string, body: unknown, valueId?: string) =>
    valueId
      ? api(`/admin/products/${productId}/options/${optionId}/values/${valueId}`, {
          method: 'PUT',
          body: JSON.stringify(body),
        })
      : api(`/admin/products/${productId}/options/${optionId}/values`, {
          method: 'POST',
          body: JSON.stringify(body),
        }),
  deleteOptionValue: (productId: string, optionId: string, valueId: string) =>
    api<void>(`/admin/products/${productId}/options/${optionId}/values/${valueId}`, {
      method: 'DELETE',
    }),

  // Inventory
  listInventory: () => api<InventoryDto[]>('/admin/inventory'),
  setInventory: (variantId: string, quantityOnHand: number) =>
    api<InventoryDto>(`/admin/inventory/${variantId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantityOnHand }),
    }),

  // Orders
  listOrders: (page = 1, pageSize = 20, status?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (status) q.set('status', status);
    return api<PagedOrdersDto>(`/admin/orders?${q}`);
  },
  getOrder: (id: string) => api<OrderDetailDto>(`/admin/orders/${id}`),
  orderReady: (id: string) => api<void>(`/admin/orders/${id}/ready`, { method: 'POST' }),
  orderTicketUrl: (id: string) => `${env.apiUrl}/admin/orders/${id}/ticket`,

  // Shipments
  listShipments: (page = 1, pageSize = 20) =>
    api<ShipmentSummaryDto[]>(`/admin/shipments?page=${page}&pageSize=${pageSize}`),
  createShipment: (body: { orderId: string; driverId: string; trackingNumber?: string }) =>
    api('/admin/shipments', { method: 'POST', body: JSON.stringify(body) }),
  shipmentInTransit: (id: string) => api<void>(`/admin/shipments/${id}/in-transit`, { method: 'PATCH' }),
  shipmentDelivered: (id: string) => api<void>(`/admin/shipments/${id}/delivered`, { method: 'PATCH' }),
  shipmentTicketUrl: (id: string) => `${env.apiUrl}/admin/shipments/${id}/ticket.pdf`,

  // Drivers
  listDrivers: () => api<DriverAdminDto[]>('/admin/drivers'),
  saveDriver: (body: unknown, id?: string) =>
    id
      ? api<DriverAdminDto>(`/admin/drivers/${id}`, { method: 'PUT', body: JSON.stringify(body) })
      : api<DriverAdminDto>('/admin/drivers', { method: 'POST', body: JSON.stringify(body) }),
  deleteDriver: (id: string) => api<void>(`/admin/drivers/${id}`, { method: 'DELETE' }),

  // Users
  listUsers: (page = 1, pageSize = 20, search?: string) => {
    const q = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (search) q.set('search', search);
    return api<PagedUsersAdminDto>(`/admin/users?${q}`);
  },
  getUser: (id: string) => api<UserAdminDto>(`/admin/users/${id}`),
  updateUser: (id: string, body: { isActive: boolean; roleCodes: string[] }) =>
    api<UserAdminDto>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
};
