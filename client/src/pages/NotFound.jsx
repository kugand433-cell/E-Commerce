import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 700 }}>404</h1>
        <h2 style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>Page not found</h2>
        <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-orange" style={{ marginTop: '1.5rem', display: 'inline-flex', borderRadius: '9999px', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
