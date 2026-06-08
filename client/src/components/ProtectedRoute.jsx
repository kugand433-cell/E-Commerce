import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) return <LoadingSpinner label="Checking session…" />;

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(pathname)}`} replace />;
  }

  if (roles && roles.length > 0 && (!user || !roles.includes(user.role))) {
    return (
      <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '5rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Access Denied</h2>
        <p style={{ marginTop: '0.5rem', color: 'var(--muted-foreground)' }}>
          You don't have permission to view this page.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
