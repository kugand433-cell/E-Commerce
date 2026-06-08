const STYLES = {
  pending: { background: 'rgba(230,168,23,0.2)', color: '#854d0e', borderColor: 'rgba(230,168,23,0.4)' },
  confirmed: { background: 'rgba(45,127,193,0.2)', color: '#1e40af', borderColor: 'rgba(45,127,193,0.4)' },
  shipped: { background: 'rgba(255,153,0,0.2)', color: '#9a3412', borderColor: 'rgba(255,153,0,0.4)' },
  delivered: { background: 'rgba(40,167,69,0.2)', color: '#166534', borderColor: 'rgba(40,167,69,0.4)' },
  cancelled: { background: 'rgba(220,53,69,0.15)', color: '#991b1b', borderColor: 'rgba(220,53,69,0.4)' },
};

export default function StatusBadge({ status }) {
  const s = STYLES[status] || {};
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      borderRadius: '9999px', border: `1px solid ${s.borderColor || 'var(--border)'}`,
      padding: '0.125rem 0.625rem',
      fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize',
      backgroundColor: s.background || 'transparent',
      color: s.color || 'inherit',
    }}>
      {status}
    </span>
  );
}
