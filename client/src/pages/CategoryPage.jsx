import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/products", { params: { category: slug, limit: 24 } })
      .then((res) => {
        const body = res.data?.data || res.data;
        setProducts(body?.products || (Array.isArray(body) ? body : []));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div style={{ marginBottom: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'linear-gradient(to right, var(--nest-navy), var(--nest-navy-light))', padding: '1.5rem', color: '#fff' }}>
        <p style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.025em', color: 'rgba(255,255,255,0.7)' }}>Category</p>
        <h1 style={{ marginTop: '0.25rem', fontSize: '1.875rem', fontWeight: 700, textTransform: 'capitalize' }}>{slug}</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <EmptyState title="No products in this category" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
          <style>{`
            @media (min-width: 768px) { div:last-child { grid-template-columns: repeat(3, 1fr) !important; } }
            @media (min-width: 1024px) { div:last-child { grid-template-columns: repeat(4, 1fr) !important; } }
            @media (min-width: 1280px) { div:last-child { grid-template-columns: repeat(5, 1fr) !important; } }
          `}</style>
        </div>
      )}
    </div>
  );
}
