import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import StarRating from "@/components/StarRating";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const rating = searchParams.get("rating") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    setLoading(true);
    const params = { limit: 12, page, sort };
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (rating) params.rating = rating;

    api.get("/products", { params })
      .then((res) => {
        const body = res.data?.data || res.data;
        setProducts(body?.products || (Array.isArray(body) ? body : []));
        setTotalPages(body?.totalPages || 1);
      })
      .catch(() => { setProducts([]); setTotalPages(1); })
      .finally(() => setLoading(false));
  }, [keyword, category, minPrice, maxPrice, rating, page, sort]);

  const update = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    next.set("page", "1");
    setSearchParams(next);
  };

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div className="grid-filters-content">
        {/* Filters */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1rem', alignSelf: 'flex-start', position: 'sticky', top: '8rem' }}>
          <div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.875rem' }}>
              {["All", "Electronics", "Fashion", "Home", "Books", "Sports", "Beauty"].map((c) => (
                <label key={c} style={{ display: 'flex', cursor: 'pointer', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="cat"
                    checked={(category || "All") === c || (!category && c === "All")}
                    onChange={() => update({ category: c === "All" ? undefined : c })}
                    style={{ accentColor: 'var(--nest-orange)' }}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Price</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => update({ minPrice: e.target.value || undefined })}
                style={{ width: '100%', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => update({ maxPrice: e.target.value || undefined })}
                style={{ width: '100%', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Rating</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[4, 3, 2, 1].map((r) => (
                <button
                  key={r}
                  onClick={() => update({ rating: rating == r ? undefined : r })}
                  style={{
                    display: 'flex', width: '100%', alignItems: 'center', gap: '0.5rem',
                    borderRadius: '4px', padding: '0.25rem 0.5rem', fontSize: '0.875rem',
                    backgroundColor: rating == r ? 'var(--muted)' : 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  <StarRating value={r} /> & up
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setSearchParams({})}
            style={{ width: '100%', borderRadius: '6px', border: '1px solid var(--border)', padding: '0.375rem', fontSize: '0.875rem', backgroundColor: 'transparent', cursor: 'pointer' }}
          >
            Clear filters
          </button>
        </aside>

        {/* Results */}
        <section>
          <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {keyword ? `Results for "${keyword}"` : "All Products"}
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{products.length} products shown</p>
            </div>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value })}
              style={{ borderRadius: '6px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <EmptyState title="No products found" description="Try adjusting your filters or search keywords." />
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              <style>{`
                @media (min-width: 768px) { section > div:nth-child(2) { grid-template-columns: repeat(3, 1fr) !important; } }
                @media (min-width: 1280px) { section > div:nth-child(2) { grid-template-columns: repeat(4, 1fr) !important; } }
              `}</style>
              {/* Pagination */}
              <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const active = page === p;
                  return (
                    <button
                      key={p}
                      onClick={() => { const next = new URLSearchParams(searchParams); next.set("page", String(p)); setSearchParams(next); }}
                      style={{
                        height: '2.25rem', minWidth: '2.25rem', borderRadius: '6px',
                        border: `1px solid ${active ? 'var(--nest-orange)' : 'var(--border)'}`,
                        padding: '0 0.75rem', fontSize: '0.875rem',
                        backgroundColor: active ? 'rgba(255,153,0,0.15)' : 'transparent',
                        fontWeight: active ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
