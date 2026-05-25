'use client';

import Link from 'next/link';
import { ProfileForm } from '@/features/auth/update-profile/ui/profile-form';
import { ProfilePhotoSection } from '@/features/auth/update-profile/ui/profile-photo-section';
import { ChangePasswordForm } from '@/features/auth/change-password/ui/change-password-form';
import { Button } from '@/shared/ui/button';

function SectionIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="lg:col-span-1">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-gray-400">{description}</p>
    </div>
  );
}

export function AccountPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
        <p className="mt-1 text-sm text-gray-400">Administra tu información personal y seguridad.</p>
      </div>

      <section className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        <SectionIntro
          title="Información de perfil"
          description="Actualice la información de su cuenta y la dirección de correo electrónico."
        />
        <div className="lg:col-span-2">
          <ProfileForm />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        <SectionIntro
          title="Foto de perfil"
          description="Actualice la foto de su perfil para personalizar su cuenta."
        />
        <div className="lg:col-span-2">
          <ProfilePhotoSection />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        <SectionIntro
          title="Actualizar contraseña"
          description="Asegúrese de que su cuenta utiliza una contraseña larga y aleatoria para mantenerse seguro."
        />
        <div className="lg:col-span-2">
          <ChangePasswordForm />
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        <SectionIntro
          title="Direcciones"
          description="Gestione sus direcciones de envío para el checkout."
        />
        <div className="lg:col-span-2">
          <Button variant="outline" className="border-gray-700 hover:bg-gray-800" asChild>
            <Link href="/account/addresses">Mis direcciones</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
