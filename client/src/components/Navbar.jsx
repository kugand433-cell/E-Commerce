import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, MapPin, User2, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const CATS = ["All", "Electronics", "Fashion", "Home", "Books", "Sports", "Beauty"];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { count, openCart } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q) params.set("keyword", q);
    if (cat !== "All") params.set("category", cat);
    navigate(`/products?${params.toString()}`);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 40, width: '100%', backgroundColor: 'var(--nest-navy)', color: '#fff', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '6px', flexShrink: 0, border: '1px solid transparent' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>Shop</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--nest-orange)' }}>Nest</span>
        </Link>

        {/* Address (desktop) */}
        <div className="desktop-only" style={{ display: 'none', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
          <MapPin style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.7)' }} />
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Deliver to</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>India</div>
          </div>
        </div>

        {/* Search (desktop) */}
        <form onSubmit={submit} className="desktop-search" style={{ display: 'none', flex: 1 }}>
          <div style={{ display: 'flex', width: '100%', overflow: 'hidden', borderRadius: '6px' }}>
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              style={{ padding: '0 0.5rem', fontSize: '0.875rem', backgroundColor: 'var(--muted)', color: 'var(--foreground)', border: 'none' }}
            >
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ShopNest"
              style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: 'var(--foreground)', border: 'none', outline: 'none' }}
            />
            <button type="submit" style={{ backgroundColor: 'var(--nest-orange)', padding: '0 1rem', border: 'none' }}>
              <Search style={{ width: 20, height: 20, color: 'var(--nest-navy)' }} />
            </button>
          </div>
        </form>

        {/* Right */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {isAuthenticated ? (
            <div className="group" style={{ position: 'relative' }}>
              <button style={{ padding: '0.25rem 0.5rem', textAlign: 'left', borderRadius: '4px', background: 'none', border: '1px solid transparent', color: '#fff' }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Hello, {user?.name?.split(" ")[0]}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'capitalize' }}>{user?.role} ▾</div>
              </button>
              <div className="group-dropdown" style={{ visibility: 'hidden', opacity: 0, position: 'absolute', right: 0, top: '100%', zIndex: 50, marginTop: '0.25rem', width: '12rem', borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--popover)', padding: '0.5rem', color: 'var(--popover-foreground)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', transition: 'all 0.15s' }}>
                <Link to="/orders" style={{ display: 'block', padding: '0.375rem 0.5rem', fontSize: '0.875rem', borderRadius: '4px' }}>My Orders</Link>
                {user?.role === "seller" && (
                  <Link to="/seller/dashboard" style={{ display: 'block', padding: '0.375rem 0.5rem', fontSize: '0.875rem', borderRadius: '4px' }}>Seller Dashboard</Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin/dashboard" style={{ display: 'block', padding: '0.375rem 0.5rem', fontSize: '0.875rem', borderRadius: '4px' }}>Admin Dashboard</Link>
                )}
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  style={{ marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.375rem 0.5rem', fontSize: '0.875rem', textAlign: 'left', color: 'var(--destructive)', borderRadius: '4px', background: 'none', border: 'none' }}
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="desktop-only" style={{ display: 'none', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
              <User2 style={{ width: 16, height: 16 }} />
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Hello, sign in</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Account ▾</div>
              </div>
            </Link>
          )}

          <button
            onClick={openCart}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: 'none', border: '1px solid transparent', color: '#fff' }}
          >
            <ShoppingCart style={{ width: 24, height: 24 }} />
            <span className="desktop-only" style={{ display: 'none', fontSize: '0.875rem', fontWeight: 600 }}>Cart</span>
            {count > 0 && (
              <span style={{ position: 'absolute', top: '-4px', left: '12px', borderRadius: '9999px', backgroundColor: 'var(--nest-orange)', padding: '0 6px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--nest-navy)' }}>
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="mobile-only"
            style={{ padding: '0.25rem', borderRadius: '4px', background: 'none', border: '1px solid transparent', color: '#fff' }}
          >
            {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={submit} className="mobile-only" style={{ padding: '0 0.75rem 0.5rem' }}>
        <div style={{ display: 'flex', overflow: 'hidden', borderRadius: '6px' }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ShopNest"
            style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.875rem', color: 'var(--foreground)', border: 'none', outline: 'none' }}
          />
          <button type="submit" style={{ backgroundColor: 'var(--nest-orange)', padding: '0 1rem', border: 'none' }}>
            <Search style={{ width: 20, height: 20, color: 'var(--nest-navy)' }} />
          </button>
        </div>
      </form>

      {/* Sub-nav (desktop) */}
      <nav className="desktop-only" style={{ display: 'none', alignItems: 'center', gap: '0.25rem', overflowX: 'auto', backgroundColor: 'var(--nest-navy-light)', padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}>
        <Link to="/" style={{ padding: '0.25rem 0.5rem', borderRadius: '4px' }}>Home</Link>
        <Link to="/products" style={{ padding: '0.25rem 0.5rem', borderRadius: '4px' }}>All Products</Link>
        {CATS.slice(1).map((c) => (
          <Link
            key={c}
            to={`/category/${c.toLowerCase()}`}
            style={{ padding: '0.25rem 0.5rem', borderRadius: '4px' }}
          >
            {c}
          </Link>
        ))}
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-only" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--nest-navy-light)', padding: '0.5rem 0.75rem' }}>
          <Link to="/" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '0.5rem', borderRadius: '4px' }}>Home</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '0.5rem', borderRadius: '4px' }}>All Products</Link>
          <Link to="/orders" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '0.5rem', borderRadius: '4px' }}>My Orders</Link>
          {user?.role === "seller" && (
            <Link to="/seller/dashboard" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '0.5rem', borderRadius: '4px' }}>Seller</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '0.5rem', borderRadius: '4px' }}>Admin</Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => { logout(); setMobileOpen(false); navigate("/"); }}
              style={{ marginTop: '0.25rem', display: 'block', width: '100%', padding: '0.5rem', textAlign: 'left', color: 'var(--destructive)', borderRadius: '4px', background: 'none', border: 'none', fontSize: '0.875rem' }}
            >
              Sign out
            </button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '0.5rem', borderRadius: '4px' }}>Sign in</Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-only { display: flex !important; }
          .desktop-search { display: flex !important; }
          .mobile-only { display: none !important; }
          .group { display: block !important; }
          .group:hover .group-dropdown { visibility: visible !important; opacity: 1 !important; }
          .group-dropdown a:hover, .group-dropdown button:hover { background-color: var(--muted); }
          nav.desktop-only a:hover { background-color: rgba(255,255,255,0.1); }
        }
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
          .desktop-search { display: none !important; }
          .mobile-only a:hover, .mobile-only button:hover { background-color: rgba(255,255,255,0.1); }
        }
      `}</style>
    </header>
  );
}
