export interface AddressDto {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
}

export interface SaveAddressRequest {
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}
