'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { addressApi } from '@/entities/address/api/address-api';
import { orderApi } from '@/entities/order/api/order-api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';

export function CheckoutShippingPage() {
  const router = useRouter();
  const [addressId, setAddressId] = useState<string>();
  const [couponCode, setCouponCode] = useState('WELCOME10');
  const { data: addresses } = useQuery({ queryKey: ['addresses'], queryFn: addressApi.list });

  const confirm = async () => {
    if (!addressId) {
      toast.error('Selecciona una dirección');
      return;
    }
    try {
      const order = await orderApi.checkout({
        addressId,
        shippingCost: 99,
        couponCode: couponCode || undefined,
      });
      router.push(`/checkout/payment/${order.orderId}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Error en checkout');
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Envío y cupón</h1>
      {addresses?.map((a) => (
        <label
          key={a.id}
          className="flex cursor-pointer gap-3 rounded-lg border border-white/10 p-4 hover:border-violet-500/50"
        >
          <input type="radio" name="addr" onChange={() => setAddressId(a.id)} />
          <div>
            <p className="font-medium">{a.label}</p>
            <p className="text-sm text-zinc-400">{a.street}, {a.city}</p>
          </div>
        </label>
      ))}
      {!addresses?.length && (
        <p className="text-sm text-amber-400">
          No tienes direcciones. Crea una en <a href="/account/addresses/new" className="underline">Mi cuenta</a>.
        </p>
      )}
      <div>
        <Label>Cupón (opcional)</Label>
        <Input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="WELCOME10" />
      </div>
      <Button onClick={confirm} disabled={!addressId}>Confirmar pedido</Button>
    </div>
  );
}
