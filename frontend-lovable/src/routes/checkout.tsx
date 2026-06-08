import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";

export const Route = createFileRoute("/checkout")({
  component: () => (
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  ),
});

function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    country: user?.address?.country || "India",
  });
  const [payment, setPayment] = useState<"COD" | "online">("COD");
  const [busy, setBusy] = useState(false);

  const place = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Your cart is empty");
    setBusy(true);
    try {
      await api.post("/orders", {
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: address,
        paymentMethod: payment,
      });
      toast.success("Order placed successfully!");
      clear();
      navigate({ to: "/orders" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not place order");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <form onSubmit={place} className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card title="Shipping Address">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label="Street" value={address.street} onChange={(v) => setAddress({ ...address, street: v })} full />
              <Input label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
              <Input label="State" value={address.state} onChange={(v) => setAddress({ ...address, state: v })} />
              <Input label="Pincode" value={address.pincode} onChange={(v) => setAddress({ ...address, pincode: v })} />
              <Input label="Country" value={address.country} onChange={(v) => setAddress({ ...address, country: v })} />
            </div>
          </Card>

          <Card title="Payment Method">
            <div className="space-y-2">
              {[
                { v: "COD", label: "Cash on Delivery", sub: "Pay when your order arrives" },
                { v: "online", label: "Pay Online", sub: "Card / UPI / Net Banking" },
              ].map((opt) => (
                <label key={opt.v} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${payment === opt.v ? "border-nest-orange bg-nest-orange/5" : ""}`}>
                  <input type="radio" checked={payment === opt.v} onChange={() => setPayment(opt.v as any)} className="mt-1 accent-nest-orange" />
                  <div>
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-muted-foreground">{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </Card>
        </div>

        <aside className="self-start rounded-xl border bg-card p-5 lg:sticky lg:top-32">
          <h3 className="font-semibold">Your Order</h3>
          <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">
            {items.map((it) => (
              <div key={it.product} className="flex justify-between text-sm">
                <span className="line-clamp-1">{it.title} × {it.quantity}</span>
                <span>₹{(it.price * it.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <hr className="my-3" />
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span>FREE</span></div>
          <div className="mt-2 flex justify-between border-t pt-2"><span className="font-semibold">Total</span><span className="text-xl font-bold">₹{subtotal.toLocaleString()}</span></div>
          <button disabled={busy} className="btn-orange mt-4 w-full rounded-full py-2.5 text-sm disabled:opacity-60">
            {busy ? "Placing order…" : "Place Order"}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="mb-3 font-semibold">{title}</h3>
      {children}
    </div>
  );
}
function Input({ label, value, onChange, full }: { label: string; value: string; onChange: (v: string) => void; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="text-sm font-medium">{label}</label>
      <input required value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-nest-orange focus:ring-2 focus:ring-nest-orange/30" />
    </div>
  );
}
