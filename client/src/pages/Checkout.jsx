import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  );
}

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
  const [payment, setPayment] = useState("COD");
  const [busy, setBusy] = useState(false);

  const inputStyle = {
    marginTop: '0.25rem', width: '100%', borderRadius: '6px',
    border: '1px solid var(--border)', backgroundColor: 'var(--background)',
    padding: '0.5rem 0.75rem', fontSize: '0.875rem', outline: 'none',
  };

  const place = async (e) => {
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
      navigate("/orders");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not place order");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Checkout</h1>
      <form onSubmit={place} className="grid-checkout-layout" style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Shipping Address</h3>
            <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Street</label>
                <input required value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>City</label>
                <input required value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>State</label>
                <input required value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Pincode</label>
                <input required value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Country</label>
                <input required value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} style={inputStyle} />
              </div>
            </div>
          </div>

          <div style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem' }}>
            <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { v: "COD", label: "Cash on Delivery", sub: "Pay when your order arrives" },
                { v: "online", label: "Pay Online", sub: "Card / UPI / Net Banking" },
              ].map((opt) => (
                <label key={opt.v} style={{ display: 'flex', cursor: 'pointer', alignItems: 'flex-start', gap: '0.75rem', borderRadius: '8px', border: `1px solid ${payment === opt.v ? 'var(--nest-orange)' : 'var(--border)'}`, padding: '0.75rem', backgroundColor: payment === opt.v ? 'rgba(255,153,0,0.05)' : 'transparent' }}>
                  <input type="radio" checked={payment === opt.v} onChange={() => setPayment(opt.v)} style={{ marginTop: '0.25rem', accentColor: 'var(--nest-orange)' }} />
                  <div>
                    <div style={{ fontWeight: 500 }}>{opt.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside style={{ alignSelf: 'flex-start', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem', position: 'sticky', top: '8rem' }}>
          <h3 style={{ fontWeight: 600 }}>Your Order</h3>
          <div style={{ marginTop: '0.75rem', maxHeight: '15rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {items.map((it) => (
              <div key={it.product} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.title} × {it.quantity}</span>
                <span>₹{(it.price * it.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}><span style={{ color: 'var(--muted-foreground)' }}>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}><span style={{ color: 'var(--muted-foreground)' }}>Shipping</span><span>FREE</span></div>
          <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem' }}><span style={{ fontWeight: 600 }}>Total</span><span style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{subtotal.toLocaleString()}</span></div>
          <button disabled={busy} className="btn-orange" style={{ marginTop: '1rem', width: '100%', borderRadius: '9999px', padding: '0.625rem', fontSize: '0.875rem' }}>
            {busy ? "Placing order…" : "Place Order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
