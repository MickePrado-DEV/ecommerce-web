import { cn } from '@/shared/lib/utils';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const styles = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
  error: 'border-red-500/40 bg-red-500/10 text-red-200',
  info: 'border-violet-500/40 bg-violet-500/10 text-violet-200',
};

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

export function Alert({
  variant = 'info',
  children,
  className,
  onDismiss,
}: {
  variant?: keyof typeof styles;
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}) {
  const Icon = icons[variant];
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
        styles[variant],
        className,
      )}
      role="alert"
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="text-xs opacity-70 hover:opacity-100">
          Cerrar
        </button>
      )}
    </div>
  );
}
