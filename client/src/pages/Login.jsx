import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}!`);
      const target = redirect ||
        (u.role === "admin" ? "/admin/dashboard" :
         u.role === "seller" ? "/seller/dashboard" : "/");
      navigate(target);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const inputStyle = {
    marginTop: '0.25rem', width: '100%', borderRadius: '6px',
    border: '1px solid var(--border)', backgroundColor: 'var(--background)',
    padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary)', padding: '2.5rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '28rem' }}>
        <Link to="/" style={{ display: 'block', textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.875rem', fontWeight: 700 }}>Shop<span style={{ color: 'var(--nest-orange)' }}>Nest</span></span>
        </Link>
        <div style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.5rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Sign in</h1>
          <form onSubmit={submit} style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            </div>
            <button disabled={busy} className="btn-orange" style={{ width: '100%', borderRadius: '6px', padding: '0.625rem', fontSize: '0.875rem' }}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
            New to ShopNest?{" "}
            <Link to="/register" className="link-nest" style={{ fontWeight: 500 }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
