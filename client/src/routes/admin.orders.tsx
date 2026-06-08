import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { ADMIN_NAV } from "@/lib/nav";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/orders")({
  component: () => (
    <ProtectedRoute roles={["admin"]}>
      <DashboardLayout title="Admin" nav={ADMIN_NAV}>
        <AllOrders />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

const STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
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

  const update = async (id: string, status: OrderStatus) => {
    try { await api.put(`/orders/${id}/status`, { status }); toast.success("Updated"); load(); }
    catch (err: any) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">All Orders</h1>
      {loading ? <LoadingSpinner /> : orders.length === 0 ? <EmptyState title="No orders" /> : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="p-3">Order</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Date</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-t">
                  <td className="p-3 font-mono text-xs">#{o._id.slice(-8)}</td>
                  <td className="p-3">{typeof o.buyer === "object" ? o.buyer.name : "—"}</td>
                  <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="p-3 font-semibold">₹{o.totalPrice.toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={o.status} />
                      <select value={o.status} onChange={(e) => update(o._id, e.target.value as OrderStatus)} className="rounded border bg-background px-2 py-1 text-xs">
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
