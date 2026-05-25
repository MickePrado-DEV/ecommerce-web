'use client';

import { CartSummary } from '@/widgets/cart-summary/ui/cart-summary';
import { Button } from '@/shared/ui/button';

/** Equivalente Livewire CartSummary en columna derecha del checkout. */
export function CheckoutOrderSummary({
  onConfirm,
  confirmDisabled,
  confirmLoading,
}: {
  onConfirm: () => void;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
}) {
  return (
    <div className="space-y-4">
      <CartSummary showCheckoutLink={false} />
      <Button
        className="w-full"
        onClick={onConfirm}
        disabled={confirmDisabled || confirmLoading}
      >
        {confirmLoading ? 'Creando pedido…' : 'Continuar al pago'}
      </Button>
    </div>
  );
}
