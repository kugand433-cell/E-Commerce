import { PackageOpen } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", description, icon, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '12px', border: '1px dashed var(--border)', backgroundColor: 'rgba(255,255,255,0.5)', padding: '4rem 0', textAlign: 'center' }}>
      <div style={{ marginBottom: '1rem', borderRadius: '9999px', backgroundColor: 'var(--muted)', padding: '1rem', color: 'var(--muted-foreground)' }}>
        {icon || <PackageOpen style={{ width: 32, height: 32 }} />}
      </div>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{title}</h3>
      {description && <p style={{ marginTop: '0.25rem', maxWidth: '24rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{description}</p>}
      {action && <div style={{ marginTop: '1rem' }}>{action}</div>}
    </div>
  );
}
