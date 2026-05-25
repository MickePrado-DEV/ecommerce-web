import Link from 'next/link';
import { Button } from '@/shared/ui/button';

export function CheckoutSuccessPage() {
  return (
    <div className="mx-auto max-w-md text-center">
      <h1 className="text-2xl font-bold text-green-400">¡Pedido confirmado!</h1>
      <p className="mt-2 text-zinc-400">Tu pago fue procesado (modo demo).</p>
      <div className="mt-6 flex justify-center gap-4">
        <Button asChild><Link href="/orders">Ver pedidos</Link></Button>
        <Button variant="outline" asChild><Link href="/">Inicio</Link></Button>
      </div>
    </div>
  );
}
