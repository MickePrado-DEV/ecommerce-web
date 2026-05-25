import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export default function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">403 — Sin permiso</h1>
      <p className="text-zinc-400">No tienes acceso a esta sección.</p>
      <Button asChild><Link href="/">Volver al inicio</Link></Button>
    </div>
  );
}
