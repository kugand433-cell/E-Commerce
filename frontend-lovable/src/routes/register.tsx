import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import type { Role } from "@/lib/types";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "customer" as Role,
  });
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form);
      toast.success("Account created!");
      navigate({ to: form.role === "seller" ? "/seller/dashboard" : "/" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed");
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
          <h1 className="text-2xl font-bold">Create account</h1>
          <form onSubmit={submit} className="mt-5 space-y-4">
            {/* Role */}
            <div className="grid grid-cols-2 gap-2">
              {(["customer", "seller"] as Role[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`rounded-md border py-2 text-sm font-medium capitalize ${
                    form.role === r ? "border-nest-orange bg-nest-orange/10 text-nest-navy" : "hover:bg-muted"
                  }`}
                >
                  {r === "customer" ? "I'm a Shopper" : "I'm a Seller"}
                </button>
              ))}
            </div>
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Field label="Password" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} hint="At least 6 characters" />
            <button disabled={busy} className="btn-orange w-full rounded-md py-2.5 text-sm disabled:opacity-60">
              {busy ? "Creating…" : "Create account"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="link-nest font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", hint }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; hint?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-nest-orange focus:ring-2 focus:ring-nest-orange/30"
      />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
