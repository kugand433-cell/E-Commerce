import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Product } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { SELLER_NAV } from "@/lib/nav";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/seller/products")({
  component: () => (
    <ProtectedRoute roles={["seller", "admin"]}>
      <DashboardLayout title="Seller" nav={SELLER_NAV}>
        <MyProducts />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

function MyProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    api.get("/products/seller/mine")
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
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Link to="/seller/products/add" className="btn-orange inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm">
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>
      {loading ? <LoadingSpinner /> : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Start by adding your first product."
          action={<Link to="/seller/products/add" className="btn-orange rounded-full px-5 py-2 text-sm">Add Product</Link>}
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Rating</th>
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
                  <td className="p-3">₹{(p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price).toLocaleString()}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">{(p.rating || 0).toFixed(1)} ★</td>
                  <td className="p-3 text-right">
                    <button onClick={() => navigate({ to: "/seller/products/edit/$id", params: { id: p._id } })} className="mr-1 rounded p-1.5 hover:bg-muted">
                      <Edit className="h-4 w-4" />
                    </button>
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
