'use client';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export function PaymentMockForm({ onPay, loading }: { onPay: () => void; loading?: boolean }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-400">
        Pago simulado. El API genera referencia MOCK-*. Sin pasarela real.
      </p>
      <div>
        <Label>Número de tarjeta</Label>
        <Input placeholder="4242 4242 4242 4242" disabled />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Vencimiento</Label>
          <Input placeholder="12/28" disabled />
        </div>
        <div>
          <Label>CVC</Label>
          <Input placeholder="123" disabled />
        </div>
      </div>
      <Button className="w-full" onClick={onPay} disabled={loading}>
        {loading ? 'Procesando…' : 'Pagar ahora'}
      </Button>
    </div>
  );
}
