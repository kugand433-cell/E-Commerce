import { Link, useLocation } from "react-router-dom";

export default function DashboardLayout({ title, nav, children }) {
  const { pathname } = useLocation();
  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.25rem 0.75rem' }}>
      <div className="grid-sidebar-content">
        <aside style={{ alignSelf: 'flex-start', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '0.75rem', position: 'sticky', top: '8rem' }}>
          <h2 style={{ padding: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>{title}</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {nav.map((n) => {
              const active = pathname === n.to;
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.875rem',
                    backgroundColor: active ? 'rgba(255,153,0,0.15)' : 'transparent',
                    fontWeight: active ? 600 : 400,
                    color: active ? 'var(--nest-navy)' : 'inherit',
                  }}
                >
                  <Icon style={{ width: 16, height: 16 }} />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <section style={{ minWidth: 0 }}>{children}</section>
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, accent = "var(--nest-orange)" }) {
  return (
    <div style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{label}</p>
          <p style={{ marginTop: '0.25rem', fontSize: '1.5rem', fontWeight: 700 }}>{value}</p>
        </div>
        <div style={{ borderRadius: '9999px', padding: '0.625rem', backgroundColor: `color-mix(in srgb, ${accent} 15%, transparent)`, color: accent }}>
          <Icon style={{ width: 20, height: 20 }} />
        </div>
      </div>
    </div>
  );
}
