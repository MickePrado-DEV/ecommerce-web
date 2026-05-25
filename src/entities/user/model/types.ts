export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  driverId?: string | null;
  phone?: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
  permissions: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterCustomerRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface RegisterDriverRequest extends RegisterCustomerRequest {
  licenseNumber: string;
  vehiclePlate: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
