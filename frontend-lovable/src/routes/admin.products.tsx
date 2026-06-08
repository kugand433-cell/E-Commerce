import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Product } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { ADMIN_NAV } from "@/lib/nav";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: () => (
    <ProtectedRoute roles={["admin"]}>
      <DashboardLayout title="Admin" nav={ADMIN_NAV}>
        <AllProducts />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

function AllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/admin/products")
      .then((r) => {
        const data = r.data?.data?.products || r.data?.products || r.data?.data || r.data;
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try { await api.delete(`/products/${id}`); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">All Products</h1>
      {loading ? <LoadingSpinner /> : products.length === 0 ? <EmptyState title="No products" /> : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Seller</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded bg-muted">
                        {p.images?.[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <span className="line-clamp-1 font-medium">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground">{typeof p.seller === "object" ? p.seller.name : "—"}</td>
                  <td className="p-3">₹{p.price.toLocaleString()}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => remove(p._id)} className="rounded p-1.5 text-destructive hover:bg-muted">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
