import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import EmptyState from "@/components/EmptyState";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1rem' }}>
        <EmptyState
          icon={<ShoppingBag style={{ width: 32, height: 32 }} />}
          title="Your cart is empty"
          description="Browse products and add items to your cart."
          action={<Link to="/products" className="btn-orange" style={{ borderRadius: '9999px', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Shop Now</Link>}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Shopping Cart</h1>
      <div className="grid-cart-layout" style={{ marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((it) => (
            <div key={it.product} style={{ display: 'flex', gap: '1rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1rem' }}>
              <div style={{ width: '6rem', height: '6rem', flexShrink: 0, overflow: 'hidden', borderRadius: '4px', backgroundColor: 'var(--muted)' }}>
                {it.image && <img src={it.image} alt={it.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <Link to={`/products/${it.product}`} style={{ fontWeight: 500 }}>{it.title}</Link>
                <p style={{ marginTop: '0.25rem', fontSize: '1.125rem', fontWeight: 700 }}>₹{it.price.toLocaleString()}</p>
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px' }}>
                    <button onClick={() => updateQuantity(it.product, it.quantity - 1)} style={{ padding: '0.375rem', background: 'none', border: 'none', cursor: 'pointer' }}><Minus style={{ width: 14, height: 14 }} /></button>
                    <span style={{ width: '2.5rem', textAlign: 'center', fontSize: '0.875rem' }}>{it.quantity}</span>
                    <button onClick={() => updateQuantity(it.product, it.quantity + 1)} style={{ padding: '0.375rem', background: 'none', border: 'none', cursor: 'pointer' }}><Plus style={{ width: 14, height: 14 }} /></button>
                  </div>
                  <button onClick={() => removeItem(it.product)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--destructive)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 style={{ width: 16, height: 16 }} /> Remove
                  </button>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '1.125rem', fontWeight: 700 }}>
                ₹{(it.price * it.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <aside style={{ alignSelf: 'flex-start', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem', position: 'sticky', top: '8rem' }}>
          <h3 style={{ fontWeight: 600 }}>Order Summary</h3>
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted-foreground)' }}>Subtotal ({items.length} items)</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted-foreground)' }}>Shipping</span><span>FREE</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted-foreground)' }}>Tax</span><span>Calculated at checkout</span></div>
          </div>
          <hr style={{ margin: '0.75rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 600 }}>Total</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{subtotal.toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="btn-orange" style={{ display: 'block', marginTop: '1rem', borderRadius: '9999px', padding: '0.625rem', textAlign: 'center', fontSize: '0.875rem' }}>
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}
