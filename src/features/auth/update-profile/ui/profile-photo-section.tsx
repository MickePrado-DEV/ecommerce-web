'use client';

import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/entities/user/api/auth-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

function initials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function ProfilePhotoSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: user } = useQuery({ queryKey: queryKeys.me, queryFn: authApi.me });

  if (!user) return null;

  const onFile = () => {
    toast.info('La subida de foto de perfil estará disponible próximamente.');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/80 p-6">
      <p className="mb-4 text-sm font-medium text-white">Foto</p>
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white text-3xl font-bold text-purple-600">
          {initials(user.firstName, user.lastName)}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFile}
          />
          <Button
            type="button"
            variant="outline"
            className="border-gray-600 bg-transparent text-xs uppercase tracking-wide text-white hover:bg-gray-800"
            onClick={() => inputRef.current?.click()}
          >
            Seleccione una nueva foto
          </Button>
        </div>
      </div>
    </div>
  );
}
