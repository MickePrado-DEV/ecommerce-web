import { ChangePasswordForm } from '@/features/auth/change-password/ui/change-password-form';
import { PageHeader } from '@/shared/ui/page-header';

export function AccountPasswordPage() {
  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="Cambiar contraseña" />
      <ChangePasswordForm />
    </div>
  );
}
