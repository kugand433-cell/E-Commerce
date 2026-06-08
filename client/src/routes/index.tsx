import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ChevronRight, Truck, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShopNest – Shop millions of products from local sellers" },
      { name: "description", content: "Discover Electronics, Fashion, Home, Books and more on ShopNest." },
    ],
  }),
  component: Home,
});

const CATEGORIES = [
  { name: "Electronics", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=70" },
  { name: "Fashion", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=70" },
  { name: "Home", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70" },
  { name: "Books", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=70" },
  { name: "Sports", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=70" },
  { name: "Beauty", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=70" },
];

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products", { params: { limit: 12, sort: "newest" } })
      .then((res) => {
        const data = res.data?.data?.products || res.data?.products || res.data?.data || res.data;
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-nest-navy via-nest-navy-light to-nest-navy">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-6 py-14 md:grid-cols-2 md:py-20">
          <div className="text-white">
            <span className="inline-block rounded-full bg-nest-orange/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-nest-orange">
              Mega Sale Live
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Everything you love, <br />
              <span className="text-nest-orange">delivered fast.</span>
            </h1>
            <p className="mt-4 max-w-md text-white/80">
              Shop from thousands of trusted sellers across electronics, fashion, home essentials and more.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/products" className="btn-orange rounded-full px-6 py-3 text-sm">Shop Now</Link>
              <Link to="/register" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/10">
                Become a Seller
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80"
              alt="Featured products"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 py-6 md:grid-cols-4">
          {[
            { Icon: Truck, t: "Free Shipping", s: "On orders over ₹499" },
            { Icon: ShieldCheck, t: "Secure Payments", s: "100% protected" },
            { Icon: RefreshCcw, t: "Easy Returns", s: "10-day return policy" },
            { Icon: Headphones, t: "24/7 Support", s: "We're here to help" },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <div className="rounded-full bg-nest-orange/15 p-2.5 text-nest-orange">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{t}</div>
                <div className="text-xs text-muted-foreground">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/products" className="link-nest text-sm">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.name}
              to="/category/$slug"
              params={{ slug: c.name.toLowerCase() }}
              className="group overflow-hidden rounded-xl border bg-card card-hover"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={c.img} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-2 text-center text-sm font-medium">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="link-nest inline-flex items-center text-sm">
            See more <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner label="Loading products…" />
        ) : products.length === 0 ? (
          <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">
            No products available yet. Connect your backend to see live products.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
