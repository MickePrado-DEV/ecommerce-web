const labels: Record<string, string> = {
  PendingPayment: 'Pendiente de pago',
  PaymentFailed: 'Pago fallido',
  Paid: 'Pagado',
  ReadyToDispatch: 'Listo para despacho',
  Shipped: 'Enviado',
  InTransit: 'En tránsito',
  Delivered: 'Entregado',
  Cancelled: 'Cancelado',
};

const variants: Record<string, 'default' | 'warning' | 'success' | 'muted'> = {
  PendingPayment: 'warning',
  PaymentFailed: 'warning',
  Paid: 'success',
  ReadyToDispatch: 'default',
  Shipped: 'default',
  InTransit: 'default',
  Delivered: 'success',
  Cancelled: 'muted',
};

export function getOrderStatusLabel(status: string): string {
  return labels[status] ?? status;
}

export function getOrderStatusVariant(status: string): 'default' | 'warning' | 'success' | 'muted' {
  return variants[status] ?? 'muted';
}

export function canCancelOrder(status: string): boolean {
  return status === 'PendingPayment' || status === 'PaymentFailed';
}

export function canPayOrder(status: string): boolean {
  return status === 'PendingPayment' || status === 'PaymentFailed';
}
