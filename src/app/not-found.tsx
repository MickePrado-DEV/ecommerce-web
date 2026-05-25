import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <Button asChild><Link href="/">Inicio</Link></Button>
    </div>
  );
}
