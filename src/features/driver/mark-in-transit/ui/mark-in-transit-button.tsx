'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { driverApi } from '@/entities/driver/api/driver-api';
import { queryKeys } from '@/shared/lib/query-keys';
import { Button } from '@/shared/ui/button';
import { toast } from 'sonner';

export function MarkInTransitButton({ shipmentId }: { shipmentId: string }) {
  const qc = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => driverApi.inTransit(shipmentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.driverShipments });
      toast.success('En tránsito');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Button size="sm" variant="outline" onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      En tránsito
    </Button>
  );
}
