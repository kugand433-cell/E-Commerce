import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { ADMIN_NAV } from "@/lib/nav";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <DashboardLayout title="Admin" nav={ADMIN_NAV}>
        <AllProducts />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function AllProducts() {
  const [products, setProducts] = useState([]);
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

  const remove = async (id) => {
    toast("Delete this product?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try { await api.delete(`/products/${id}`); toast.success("Deleted"); load(); }
          catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.25rem', fontSize: '1.5rem', fontWeight: 700 }}>All Products</h1>
      {loading ? <LoadingSpinner /> : products.length === 0 ? <EmptyState title="No products" /> : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          <table className="table-auto">
            <thead><tr><th>Product</th><th>Seller</th><th>Price</th><th>Stock</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '3rem', height: '3rem', overflow: 'hidden', borderRadius: '4px', backgroundColor: 'var(--muted)' }}>
                        {p.images?.[0] && <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <span style={{ fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{typeof p.seller === "object" ? p.seller.name : "—"}</td>
                  <td>₹{p.price.toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => remove(p._id)} style={{ padding: '0.375rem', borderRadius: '4px', color: 'var(--destructive)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 style={{ width: 16, height: 16 }} />
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
