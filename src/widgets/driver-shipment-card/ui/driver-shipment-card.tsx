import Link from 'next/link';
import type { DriverShipmentDto } from '@/entities/driver/api/driver-api';
import { MarkInTransitButton } from '@/features/driver/mark-in-transit/ui/mark-in-transit-button';
import { MarkDeliveredButton } from '@/features/driver/mark-delivered/ui/mark-delivered-button';

export function DriverShipmentCard({ shipment }: { shipment: DriverShipmentDto }) {
  return (
    <div className="rounded-lg border border-white/10 p-4">
      <p className="font-medium">
        <Link href={`/driver/shipments/${shipment.shipmentId}`} className="text-violet-400 hover:underline">
          {shipment.orderNumber}
        </Link>
        {' '}
        · {shipment.status}
      </p>
      <p className="text-sm text-zinc-400">{shipment.customerName}</p>
      <p className="text-sm">
        {shipment.street}, {shipment.city}
      </p>
      <div className="mt-3 flex gap-2">
        <MarkInTransitButton shipmentId={shipment.shipmentId} />
        <MarkDeliveredButton shipmentId={shipment.shipmentId} />
      </div>
    </div>
  );
}
