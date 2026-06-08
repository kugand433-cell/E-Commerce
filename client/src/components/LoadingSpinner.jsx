import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label, className = "" }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '3rem 0' }} className={className}>
      <Loader2 style={{ width: 32, height: 32, color: 'var(--nest-orange)', animation: 'spin 1s linear infinite' }} />
      {label && <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{label}</p>}
    </div>
  );
}
