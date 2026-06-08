import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import StarRating from "@/components/StarRating";

interface ProductSearch {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  sort?: string;
}

export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): ProductSearch => ({
    keyword: typeof s.keyword === "string" ? s.keyword : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    minPrice: s.minPrice ? Number(s.minPrice) : undefined,
    maxPrice: s.maxPrice ? Number(s.maxPrice) : undefined,
    rating: s.rating ? Number(s.rating) : undefined,
    page: s.page ? Number(s.page) : 1,
    sort: typeof s.sort === "string" ? s.sort : "newest",
  }),
  component: ProductsListing,
});

function ProductsListing() {
  const search = useSearch({ from: "/products" });
  const navigate = useNavigate({ from: "/products" });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api.get("/products", { params: { ...search, limit: 12 } })
      .then((res) => {
        const body = res.data?.data || res.data;
        setProducts(body?.products || (Array.isArray(body) ? body : []));
        setTotalPages(body?.totalPages || 1);
      })
      .catch(() => { setProducts([]); setTotalPages(1); })
      .finally(() => setLoading(false));
  }, [JSON.stringify(search)]);

  const update = (patch: Partial<ProductSearch>) =>
    navigate({ search: (prev: any) => ({ ...prev, ...patch, page: 1 }) as any });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="space-y-6 rounded-xl border bg-card p-4 lg:sticky lg:top-32 lg:self-start">
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Category</h3>
            <div className="space-y-1.5 text-sm">
              {["All", "Electronics", "Fashion", "Home", "Books", "Sports", "Beauty"].map((c) => (
                <label key={c} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="cat"
                    checked={(search.category || "All") === c}
                    onChange={() => update({ category: c === "All" ? undefined : c })}
                    className="accent-nest-orange"
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Price</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={search.minPrice ?? ""}
                onChange={(e) => update({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded border bg-background px-2 py-1 text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={search.maxPrice ?? ""}
                onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded border bg-background px-2 py-1 text-sm"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">Rating</h3>
            <div className="space-y-1.5">
              {[4, 3, 2, 1].map((r) => (
                <button
                  key={r}
                  onClick={() => update({ rating: search.rating === r ? undefined : r })}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1 text-sm hover:bg-muted ${search.rating === r ? "bg-muted" : ""}`}
                >
                  <StarRating value={r} /> & up
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate({ search: {} as any })}
            className="w-full rounded-md border py-1.5 text-sm hover:bg-muted"
          >
            Clear filters
          </button>
        </aside>

        {/* Results */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold">
                {search.keyword ? `Results for "${search.keyword}"` : "All Products"}
              </h1>
              <p className="text-sm text-muted-foreground">{products.length} products shown</p>
            </div>
            <select
              value={search.sort}
              onChange={(e) => update({ sort: e.target.value })}
              className="rounded-md border bg-card px-3 py-2 text-sm"
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
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              <div className="mt-8 flex items-center justify-center gap-1">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  const active = (search.page || 1) === p;
                  return (
                    <button
                      key={p}
                      onClick={() => navigate({ search: (prev: any) => ({ ...prev, page: p }) as any })}
                      className={`h-9 min-w-9 rounded-md border px-3 text-sm ${active ? "border-nest-orange bg-nest-orange/15 font-semibold" : "hover:bg-muted"}`}
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
