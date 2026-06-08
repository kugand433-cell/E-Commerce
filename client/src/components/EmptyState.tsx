import { PackageOpen } from "lucide-react";
import type { ReactNode } from "react";

export default function EmptyState({
  title = "Nothing here yet",
  description,
  icon,
  action,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card/50 py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4 text-muted-foreground">
        {icon || <PackageOpen className="h-8 w-8" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
