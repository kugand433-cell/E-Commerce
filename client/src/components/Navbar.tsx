import { Link, useNavigate } from "@tanstack/react-router";
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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/products",
      search: { keyword: q || undefined, category: cat !== "All" ? cat : undefined } as any,
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-nest-navy text-white shadow-md">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-3 py-2 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-1 rounded-md px-2 py-1 ring-1 ring-transparent hover:ring-white">
          <span className="text-xl font-bold text-white">Shop</span>
          <span className="text-xl font-bold text-nest-orange">Nest</span>
        </Link>

        {/* Address (desktop) */}
        <div className="hidden lg:flex items-center gap-1 rounded px-2 py-1 ring-1 ring-transparent hover:ring-white">
          <MapPin className="h-4 w-4 text-white/70" />
          <div className="leading-tight">
            <div className="text-xs text-white/70">Deliver to</div>
            <div className="text-sm font-semibold">India</div>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={submit} className="hidden flex-1 md:flex">
          <div className="flex w-full overflow-hidden rounded-md">
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="hidden bg-muted px-2 text-sm text-foreground sm:block"
            >
              {CATS.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ShopNest"
              className="flex-1 bg-white px-3 py-2 text-sm text-foreground outline-none"
            />
            <button type="submit" className="bg-nest-orange px-4 hover:bg-nest-orange-hover">
              <Search className="h-5 w-5 text-nest-navy" />
            </button>
          </div>
        </form>

        {/* Right */}
        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {isAuthenticated ? (
            <div className="group relative hidden md:block">
              <button className="rounded px-2 py-1 text-left ring-1 ring-transparent hover:ring-white">
                <div className="text-xs text-white/70">Hello, {user?.name?.split(" ")[0]}</div>
                <div className="text-sm font-semibold capitalize">{user?.role} ▾</div>
              </button>
              <div className="invisible absolute right-0 top-full z-50 mt-1 w-48 rounded-md border bg-popover p-2 text-popover-foreground opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                <Link to="/orders" className="block rounded px-2 py-1.5 text-sm hover:bg-muted">My Orders</Link>
                {user?.role === "seller" && (
                  <Link to="/seller/dashboard" className="block rounded px-2 py-1.5 text-sm hover:bg-muted">Seller Dashboard</Link>
                )}
                {user?.role === "admin" && (
                  <Link to="/admin/dashboard" className="block rounded px-2 py-1.5 text-sm hover:bg-muted">Admin Dashboard</Link>
                )}
                <button
                  onClick={() => { logout(); navigate({ to: "/" }); }}
                  className="mt-1 block w-full rounded px-2 py-1.5 text-left text-sm text-destructive hover:bg-muted"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:flex items-center gap-1 rounded px-2 py-1 ring-1 ring-transparent hover:ring-white">
              <User2 className="h-4 w-4" />
              <div className="leading-tight">
                <div className="text-xs text-white/70">Hello, sign in</div>
                <div className="text-sm font-semibold">Account ▾</div>
              </div>
            </Link>
          )}

          <button
            onClick={openCart}
            className="relative flex items-center gap-1 rounded px-2 py-1 ring-1 ring-transparent hover:ring-white"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="hidden text-sm font-semibold sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -top-1 left-3 rounded-full bg-nest-orange px-1.5 text-xs font-bold text-nest-navy">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden rounded p-1 ring-1 ring-transparent hover:ring-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <form onSubmit={submit} className="px-3 pb-2 md:hidden">
        <div className="flex overflow-hidden rounded-md">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ShopNest"
            className="flex-1 bg-white px-3 py-2 text-sm text-foreground outline-none"
          />
          <button className="bg-nest-orange px-4">
            <Search className="h-5 w-5 text-nest-navy" />
          </button>
        </div>
      </form>

      {/* Sub-nav */}
      <nav className="hidden md:flex items-center gap-1 overflow-x-auto bg-nest-navy-light px-3 py-1.5 text-sm">
        <Link to="/" className="rounded px-2 py-1 hover:bg-white/10">Home</Link>
        <Link to="/products" className="rounded px-2 py-1 hover:bg-white/10">All Products</Link>
        {CATS.slice(1).map((c) => (
          <Link
            key={c}
            to="/category/$slug"
            params={{ slug: c.toLowerCase() }}
            className="rounded px-2 py-1 hover:bg-white/10"
          >
            {c}
          </Link>
        ))}
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-nest-navy-light px-3 py-2 md:hidden">
          <Link to="/" onClick={() => setMobileOpen(false)} className="block rounded px-2 py-2 hover:bg-white/10">Home</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)} className="block rounded px-2 py-2 hover:bg-white/10">All Products</Link>
          <Link to="/orders" onClick={() => setMobileOpen(false)} className="block rounded px-2 py-2 hover:bg-white/10">My Orders</Link>
          {user?.role === "seller" && (
            <Link to="/seller/dashboard" onClick={() => setMobileOpen(false)} className="block rounded px-2 py-2 hover:bg-white/10">Seller</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin/dashboard" onClick={() => setMobileOpen(false)} className="block rounded px-2 py-2 hover:bg-white/10">Admin</Link>
          )}
          {isAuthenticated ? (
            <button
              onClick={() => { logout(); setMobileOpen(false); navigate({ to: "/" }); }}
              className="mt-1 block w-full rounded px-2 py-2 text-left text-destructive hover:bg-white/10"
            >
              Sign out
            </button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="block rounded px-2 py-2 hover:bg-white/10">Sign in</Link>
          )}
        </div>
      )}
    </header>
  );
}
