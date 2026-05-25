export function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {action}
    </div>
  );
}
