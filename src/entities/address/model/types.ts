export interface AddressDto {
  id: string;
  type: number;
  label: string;
  contactName?: string | null;
  street: string;
  externalNumber?: string | null;
  internalNumber?: string | null;
  neighborhood?: string | null;
  municipality?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  references?: string | null;
  deliveryInstructions?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault: boolean;
}

export interface SaveAddressRequest {
  label: string;
  type: number;
  contactName: string;
  street: string;
  externalNumber: string;
  internalNumber?: string;
  neighborhood: string;
  municipality: string;
  city?: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  references?: string;
  deliveryInstructions?: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export const ADDRESS_TYPES = [
  { value: 1, label: 'Casa' },
  { value: 2, label: 'Oficina' },
  { value: 3, label: 'Otra' },
  { value: 4, label: 'Facturación' },
] as const;
