import { api } from '@/shared/api/client';
import type {
  ChangePasswordRequest,
  MandatoryChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterCustomerRequest,
  RegisterDriverRequest,
  UpdateProfileRequest,
  UserDto,
} from '../model/types';

export const authApi = {
  login: (body: LoginRequest) =>
    api<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body), auth: false }),

  refresh: (refreshToken: string) =>
    api<LoginResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
      auth: false,
    }),

  registerCustomer: (body: RegisterCustomerRequest) =>
    api<LoginResponse>('/auth/register/customer', { method: 'POST', body: JSON.stringify(body), auth: false }),

  registerDriver: (body: RegisterDriverRequest) =>
    api<LoginResponse>('/auth/register/driver', { method: 'POST', body: JSON.stringify(body), auth: false }),

  logout: () => api<void>('/auth/logout', { method: 'POST' }),

  me: () => api<UserDto>('/auth/me'),

  updateProfile: (body: UpdateProfileRequest) =>
    api<UserDto>('/auth/me', { method: 'PATCH', body: JSON.stringify(body) }),

  changePassword: (body: ChangePasswordRequest) =>
    api<void>('/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),

  changePasswordMandatory: (body: MandatoryChangePasswordRequest) =>
    api<void>('/auth/change-password/mandatory', { method: 'POST', body: JSON.stringify(body) }),
};
