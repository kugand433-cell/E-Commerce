import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const [products, setProducts] = useState<Product[]>([]);
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
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="mb-6 rounded-xl border bg-gradient-to-r from-nest-navy to-nest-navy-light p-6 text-white">
        <p className="text-sm uppercase tracking-wide text-white/70">Category</p>
        <h1 className="mt-1 text-3xl font-bold capitalize">{slug}</h1>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <EmptyState title="No products in this category" />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}
