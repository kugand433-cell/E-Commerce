import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { SELLER_NAV } from "@/lib/nav";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function SellerProducts() {
  return (
    <ProtectedRoute roles={["seller", "admin"]}>
      <DashboardLayout title="Seller" nav={SELLER_NAV}>
        <MyProducts />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function MyProducts() {
  const [products, setProducts] = useState([]);
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

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Products</h1>
        <Link to="/seller/products/add" className="btn-orange" style={{ borderRadius: '9999px', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <Plus style={{ width: 16, height: 16 }} /> Add Product
        </Link>
      </div>
      {loading ? <LoadingSpinner /> : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Start by adding your first product."
          action={<Link to="/seller/products/add" className="btn-orange" style={{ borderRadius: '9999px', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>Add Product</Link>}
        />
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          <table className="table-auto">
            <thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Rating</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
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
                  <td>₹{(p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price).toLocaleString()}</td>
                  <td>{p.stock}</td>
                  <td>{(p.rating || 0).toFixed(1)} ★</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => navigate(`/seller/products/edit/${p._id}`)} style={{ marginRight: '0.25rem', padding: '0.375rem', borderRadius: '4px', background: 'none', border: 'none', cursor: 'pointer' }}><Edit style={{ width: 16, height: 16 }} /></button>
                    <button onClick={() => remove(p._id)} style={{ padding: '0.375rem', borderRadius: '4px', color: 'var(--destructive)', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 style={{ width: 16, height: 16 }} /></button>
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
