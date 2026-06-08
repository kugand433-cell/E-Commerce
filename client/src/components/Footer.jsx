import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ marginTop: '3rem', backgroundColor: 'var(--nest-navy)', color: '#fff' }}>
      <div className="grid-footer" style={{ maxWidth: '80rem', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div>
          <h4 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Get to Know Us</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
            <li><Link to="/" style={{ color: 'inherit' }}>About ShopNest</Link></li>
            <li><Link to="/" style={{ color: 'inherit' }}>Careers</Link></li>
            <li><Link to="/" style={{ color: 'inherit' }}>Press</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Make Money with Us</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
            <li><Link to="/register" style={{ color: 'inherit' }}>Sell on ShopNest</Link></li>
            <li><Link to="/" style={{ color: 'inherit' }}>Become an Affiliate</Link></li>
            <li><Link to="/" style={{ color: 'inherit' }}>Advertise</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Customer Service</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
            <li><Link to="/orders" style={{ color: 'inherit' }}>Your Orders</Link></li>
            <li><Link to="/" style={{ color: 'inherit' }}>Returns & Replacements</Link></li>
            <li><Link to="/" style={{ color: 'inherit' }}>Help Center</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Stay Connected</h4>
          <p style={{ marginBottom: '0.75rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Get deals & updates in your inbox.</p>
          <form style={{ display: 'flex', overflow: 'hidden', borderRadius: '6px' }}>
            <input style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: 'var(--foreground)', border: 'none', outline: 'none' }} placeholder="Email address" />
            <button style={{ backgroundColor: 'var(--nest-orange)', padding: '0 1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--nest-navy)', border: 'none' }}>Join</button>
          </form>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
        © {new Date().getFullYear()} ShopNest. Built as an internship project.
      </div>
    </footer>
  );
}
