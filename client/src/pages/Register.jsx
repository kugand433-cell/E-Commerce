import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form);
      toast.success("Account created!");
      navigate(form.role === "seller" ? "/seller/dashboard" : "/");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
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
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Create account</h1>
          <form onSubmit={submit} style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {["customer", "seller"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  style={{
                    borderRadius: '6px', padding: '0.5rem', fontSize: '0.875rem', fontWeight: 500, textTransform: 'capitalize',
                    border: `1px solid ${form.role === r ? 'var(--nest-orange)' : 'var(--border)'}`,
                    backgroundColor: form.role === r ? 'rgba(255,153,0,0.1)' : 'transparent',
                    color: form.role === r ? 'var(--nest-navy)' : 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  {r === "customer" ? "I'm a Shopper" : "I'm a Seller"}
                </button>
              ))}
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Email</label>
              <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
              <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} />
              <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>At least 6 characters</p>
            </div>
            <button disabled={busy} className="btn-orange" style={{ width: '100%', borderRadius: '6px', padding: '0.625rem', fontSize: '0.875rem' }}>
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
            Already have an account?{" "}
            <Link to="/login" className="link-nest" style={{ fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
