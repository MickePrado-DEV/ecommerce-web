import { RegisterCustomerForm } from '@/features/auth/register-customer/ui/register-customer-form';

export function RegisterPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <RegisterCustomerForm />
    </div>
  );
}
