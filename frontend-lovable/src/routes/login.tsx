import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name}!`);
      const target = search.redirect ||
        (u.role === "admin" ? "/admin/dashboard" :
         u.role === "seller" ? "/seller/dashboard" : "/");
      navigate({ to: target });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mx-auto mb-6 block text-center">
          <span className="text-3xl font-bold">Shop<span className="text-nest-orange">Nest</span></span>
        </Link>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Sign in</h1>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-nest-orange focus:ring-2 focus:ring-nest-orange/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-nest-orange focus:ring-2 focus:ring-nest-orange/30"
              />
            </div>
            <button disabled={busy} className="btn-orange w-full rounded-md py-2.5 text-sm disabled:opacity-60">
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            New to ShopNest?{" "}
            <Link to="/register" className="link-nest font-medium">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
