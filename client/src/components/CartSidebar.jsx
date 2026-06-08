import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, count } = useCart();

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 50,
          backgroundColor: 'rgba(0,0,0,0.5)',
          transition: 'opacity 0.2s',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={closeCart}
      />
      <aside
        style={{
          position: 'fixed', right: 0, top: 0, zIndex: 50,
          display: 'flex', flexDirection: 'column',
          height: '100%', width: '100%', maxWidth: '28rem',
          backgroundColor: 'var(--card)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          transition: 'transform 0.3s',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', padding: '0.75rem 1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>
            <ShoppingBag style={{ width: 20, height: 20 }} /> Your Cart ({count})
          </h3>
          <button onClick={closeCart} style={{ padding: '0.25rem', borderRadius: '4px', background: 'none', border: 'none' }}>
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 1.5rem', textAlign: 'center' }}>
            <ShoppingBag style={{ marginBottom: '0.75rem', width: 48, height: 48, color: 'var(--muted-foreground)' }} />
            <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>Your cart is empty</p>
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Add items to get started</p>
            <button onClick={closeCart} className="btn-orange" style={{ marginTop: '1rem', borderRadius: '9999px', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((it) => (
                <div key={it.product} style={{ display: 'flex', gap: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', padding: '0.5rem' }}>
                  <div style={{ height: '5rem', width: '5rem', flexShrink: 0, overflow: 'hidden', borderRadius: '4px', backgroundColor: 'var(--muted)' }}>
                    {it.image && <img src={it.image} alt={it.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.title}</p>
                    <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', fontWeight: 700 }}>₹{it.price.toLocaleString()}</p>
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px' }}>
                        <button onClick={() => updateQuantity(it.product, it.quantity - 1)} style={{ padding: '0.25rem', background: 'none', border: 'none' }}>
                          <Minus style={{ width: 14, height: 14 }} />
                        </button>
                        <span style={{ width: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>{it.quantity}</span>
                        <button onClick={() => updateQuantity(it.product, it.quantity + 1)} style={{ padding: '0.25rem', background: 'none', border: 'none' }}>
                          <Plus style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(it.product)} style={{ marginLeft: 'auto', padding: '0.25rem', color: 'var(--destructive)', background: 'none', border: 'none', borderRadius: '4px' }}>
                        <Trash2 style={{ width: 16, height: 16 }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', backgroundColor: 'rgba(240,239,233,0.5)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--muted-foreground)' }}>Subtotal</span>
                <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>₹{subtotal.toLocaleString()}</span>
              </div>
              <Link
                to="/cart"
                onClick={closeCart}
                style={{ display: 'block', width: '100%', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '0.5rem', textAlign: 'center', fontSize: '0.875rem', fontWeight: 500 }}
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="btn-orange"
                style={{ display: 'block', width: '100%', borderRadius: '6px', padding: '0.625rem', textAlign: 'center', fontSize: '0.875rem' }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
