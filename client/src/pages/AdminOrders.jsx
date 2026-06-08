import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { ADMIN_NAV } from "@/lib/nav";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <DashboardLayout title="Admin" nav={ADMIN_NAV}>
        <AllOrders />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/admin/orders")
      .then((r) => {
        const data = r.data?.data?.orders || r.data?.orders || r.data?.data || r.data;
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const update = async (id, status) => {
    try { await api.put(`/orders/${id}/status`, { status }); toast.success("Updated"); load(); }
    catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.25rem', fontSize: '1.5rem', fontWeight: 700 }}>All Orders</h1>
      {loading ? <LoadingSpinner /> : orders.length === 0 ? <EmptyState title="No orders" /> : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          <table className="table-auto">
            <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>#{o._id.slice(-8)}</td>
                  <td>{typeof o.buyer === "object" ? o.buyer.name : "—"}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>₹{o.totalPrice.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusBadge status={o.status} />
                      <select value={o.status} onChange={(e) => update(o._id, e.target.value)} style={{ borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
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
