import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { SELLER_NAV } from "@/lib/nav";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function SellerOrders() {
  return (
    <ProtectedRoute roles={["seller", "admin"]}>
      <DashboardLayout title="Seller" nav={SELLER_NAV}>
        <SellerOrdersContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function SellerOrdersContent() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/orders/mine")
      .then((r) => {
        const data = r.data?.data?.orders || r.data?.orders || r.data?.data || r.data;
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      toast.success("Status updated");
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.25rem', fontSize: '1.5rem', fontWeight: 700 }}>Orders</h1>
      {loading ? <LoadingSpinner /> : orders.length === 0 ? (
        <EmptyState title="No orders received yet" />
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          <table className="table-auto">
            <thead><tr><th>Order</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>#{o._id.slice(-8)}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>{o.items.length}</td>
                  <td style={{ fontWeight: 600 }}>₹{o.totalPrice.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusBadge status={o.status} />
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                        style={{ borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
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
