'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverApi } from '@/entities/driver/api/driver-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function MarkDeliveredButton({ shipmentId }: { shipmentId: string }) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => driverApi.delivered(shipmentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.driverShipments });
      toast.success('Entregado');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Button size="sm" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      Entregado
    </Button>
  );
}
