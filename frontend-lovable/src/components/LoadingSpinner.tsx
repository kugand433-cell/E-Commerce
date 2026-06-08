import { Loader2 } from "lucide-react";

export default function LoadingSpinner({
  label,
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
      <Loader2 className="h-8 w-8 animate-spin text-nest-orange" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}
