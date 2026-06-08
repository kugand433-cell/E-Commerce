import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ChevronRight, Truck, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";

const CATEGORIES = [
  { name: "Electronics", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=70" },
  { name: "Fashion", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=70" },
  { name: "Home", img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70" },
  { name: "Books", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=70" },
  { name: "Sports", img: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&q=70" },
  { name: "Beauty", img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&q=70" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
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
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-badge">Mega Sale Live</span>
            <h1 className="hero-title">
              Everything you love, <br />
              <span className="text-nest-orange">delivered fast.</span>
            </h1>
            <p className="hero-subtitle">
              Shop from thousands of trusted sellers across electronics, fashion, home essentials and more.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn-orange hero-btn">Shop Now</Link>
              <Link to="/register" className="hero-btn-outline">Become a Seller</Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80"
              alt="Featured products"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="trust-strip-section">
        <div className="trust-strip-container">
          {[
            { Icon: Truck, t: "Free Shipping", s: "On orders over ₹499" },
            { Icon: ShieldCheck, t: "Secure Payments", s: "100% protected" },
            { Icon: RefreshCcw, t: "Easy Returns", s: "10-day return policy" },
            { Icon: Headphones, t: "24/7 Support", s: "We're here to help" },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="trust-item">
              <div className="trust-icon-wrapper">
                <Icon className="trust-icon" />
              </div>
              <div>
                <div className="trust-title">{t}</div>
                <div className="trust-subtitle">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section-container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="link-nest section-link">View all</Link>
        </div>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <Link key={c.name} to={`/category/${c.name.toLowerCase()}`} className="category-card card-hover">
              <div className="category-img-wrapper">
                <img src={c.img} alt={c.name} loading="lazy" className="category-img" />
              </div>
              <div className="category-name">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="section-container pb-16">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/products" className="link-nest section-link flex-align">
            See more <ChevronRight style={{ width: 16, height: 16 }} />
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner label="Loading products…" />
        ) : products.length === 0 ? (
          <div className="empty-state">
            No products available yet. Connect your backend to see live products.
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
