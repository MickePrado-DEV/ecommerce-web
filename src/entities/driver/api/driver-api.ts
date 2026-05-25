import { api } from '@/shared/api/client';

export interface DriverProfileDto {
  userId: string;
  driverId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  licenseNumber?: string | null;
  vehiclePlate?: string | null;
}

export interface DriverShipmentDto {
  shipmentId: string;
  orderId: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string | null;
  createdAt: string;
  customerName: string;
  customerPhone?: string | null;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const driverApi = {
  me: () => api<DriverProfileDto>('/driver/me'),
  shipments: () => api<DriverShipmentDto[]>('/driver/shipments'),
  inTransit: (id: string) => api<void>(`/driver/shipments/${id}/in-transit`, { method: 'PATCH' }),
  delivered: (id: string) => api<void>(`/driver/shipments/${id}/delivered`, { method: 'PATCH' }),
};
