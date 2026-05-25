import { Suspense } from 'react';
import { LoginForm } from '@/features/auth/login/ui/login-form';

export function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
