'use client';

import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';

export function CouponField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>Cupón (opcional)</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ej. WELCOME10"
      />
      <p className="mt-1 text-xs text-zinc-500">Demo: WELCOME10</p>
    </div>
  );
}
