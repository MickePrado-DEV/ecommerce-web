'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, CreditCard } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { StoreCard } from '@/shared/ui/store-card';
import { PillBadge } from '@/shared/ui/pill-badge';
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
  totalLabel,
}: {
  onPay: (card: PayOrderRequest) => void;
  loading?: boolean;
  totalLabel?: string;
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

  const fillApproved = () => {
    form.setValue('holderName', 'Cliente Demo');
    form.setValue('number', '4242424242424242');
    form.setValue('expMonth', 12);
    form.setValue('expYear', new Date().getFullYear() + 2);
    form.setValue('cvv', '123');
  };

  const fillDeclined = () => {
    form.setValue('holderName', 'Rechazo Demo');
    form.setValue('number', '4000000000000002');
    form.setValue('expMonth', 12);
    form.setValue('expYear', new Date().getFullYear() + 2);
    form.setValue('cvv', '123');
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
        <p className="font-medium">Modo simulación (desarrollo)</p>
        <p className="mt-1 text-amber-200/80">
          Sin pasarela real. Tarjeta que termina en <strong>0002</strong> será rechazada.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={fillApproved}
            className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20"
          >
            Tarjeta aprobada
          </button>
          <button
            type="button"
            onClick={fillDeclined}
            className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/20"
          >
            Tarjeta rechazada
          </button>
        </div>
      </div>

      <StoreCard>
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
          <CreditCard className="h-5 w-5 text-violet-400" />
          Datos de la tarjeta
        </h3>
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
          <div>
            <Label>Titular</Label>
            <Input {...form.register('holderName')} placeholder="Nombre en la tarjeta" className="mt-1 border-slate-700 bg-slate-900" />
          </div>
          <div>
            <Label>Número</Label>
            <Input {...form.register('number')} placeholder="4242424242424242" inputMode="numeric" className="mt-1 border-slate-700 bg-slate-900" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Mes</Label>
              <Input type="number" {...form.register('expMonth')} min={1} max={12} className="mt-1 border-slate-700 bg-slate-900" />
            </div>
            <div>
              <Label>Año</Label>
              <Input type="number" {...form.register('expYear')} className="mt-1 border-slate-700 bg-slate-900" />
            </div>
            <div>
              <Label>CVV</Label>
              <Input type="password" {...form.register('cvv')} maxLength={4} className="mt-1 border-slate-700 bg-slate-900" />
            </div>
          </div>
          <Button type="submit" size="lg" className="w-full bg-violet-600 hover:bg-violet-700" disabled={loading}>
            <Lock className="mr-2 h-4 w-4" />
            {loading ? 'Procesando…' : totalLabel ?? 'Pagar ahora'}
          </Button>
        </form>
      </StoreCard>
    </div>
  );
}
