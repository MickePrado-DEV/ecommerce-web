'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import type { PayOrderRequest } from '@/entities/order/model/payment-types';

const schema = z.object({
  holderName: z.string().min(1).max(120),
  number: z.string().min(13).max(19),
  expMonth: z.coerce.number().min(1).max(12),
  expYear: z.coerce.number().min(2024).max(2099),
  cvv: z.string().regex(/^\d{3,4}$/),
});

export function PaymentMockForm({
  onPay,
  loading,
}: {
  onPay: (card: PayOrderRequest) => void;
  loading?: boolean;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      holderName: '',
      number: '',
      expMonth: 12,
      expYear: new Date().getFullYear() + 2,
      cvv: '',
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((d) =>
        onPay({
          holderName: d.holderName,
          number: d.number.replace(/\s/g, ''),
          expMonth: d.expMonth,
          expYear: d.expYear,
          cvv: d.cvv,
        }),
      )}
      className="space-y-4"
    >
      <p className="text-sm text-zinc-400">
        Pago simulado. Tarjeta que termina en <strong>0002</strong> será rechazada. Sin pasarela real.
      </p>
      <div>
        <Label>Titular</Label>
        <Input {...form.register('holderName')} placeholder="Nombre en la tarjeta" />
      </div>
      <div>
        <Label>Número de tarjeta</Label>
        <Input {...form.register('number')} placeholder="4242424242424242" inputMode="numeric" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Mes</Label>
          <Input type="number" {...form.register('expMonth')} min={1} max={12} />
        </div>
        <div>
          <Label>Año</Label>
          <Input type="number" {...form.register('expYear')} />
        </div>
        <div>
          <Label>CVV</Label>
          <Input type="password" {...form.register('cvv')} maxLength={4} />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Procesando…' : 'Pagar ahora'}
      </Button>
    </form>
  );
}
