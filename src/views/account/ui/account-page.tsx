import Link from 'next/link';
import { ProfileForm } from '@/features/auth/update-profile/ui/profile-form';
import { PageHeader } from '@/shared/ui/page-header';
import { Button } from '@/shared/ui/button';

export function AccountPage() {
  return (
    <div className="mx-auto max-w-lg space-y-8">
      <PageHeader title="Mi cuenta" />
      <ProfileForm />
      <div className="flex flex-col gap-2">
        <Button variant="outline" asChild>
          <Link href="/account/addresses">Mis direcciones</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/account/password">Cambiar contraseña</Link>
        </Button>
      </div>
    </div>
  );
}
