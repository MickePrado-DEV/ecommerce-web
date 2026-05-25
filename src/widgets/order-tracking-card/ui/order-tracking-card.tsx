import type { OrderTrackingDto } from '@/entities/order/model/types';
import { OrderStatusBadge } from '@/entities/order/ui/order-status-badge';
import { getOrderStatusLabel } from '@/shared/lib/order-status';

export function OrderTrackingCard({ tracking }: { tracking: OrderTrackingDto }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-400">Pedido:</span>
        <OrderStatusBadge status={tracking.orderStatus} />
      </div>
      {tracking.shipment ? (
        <ul className="space-y-2 text-sm">
          <li>
            <span className="text-zinc-400">Envío: </span>
            {getOrderStatusLabel(tracking.shipment.status)}
          </li>
          {tracking.shipment.trackingNumber && (
            <li>
              <span className="text-zinc-400">Tracking: </span>
              {tracking.shipment.trackingNumber}
            </li>
          )}
          {tracking.shipment.driverName && (
            <li>
              <span className="text-zinc-400">Repartidor: </span>
              {tracking.shipment.driverName}
            </li>
          )}
        </ul>
      ) : (
        <p className="text-sm text-zinc-500">Sin envío asignado aún.</p>
      )}
    </div>
  );
}
