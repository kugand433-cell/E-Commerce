import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Order } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { Package } from "lucide-react";

export const Route = createFileRoute("/orders")({
  component: () => (
    <ProtectedRoute><OrdersPage /></ProtectedRoute>
  ),
});

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/mine")
      .then((r) => {
        const data = r.data?.data?.orders || r.data?.orders || r.data?.data || r.data;
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
      <h1 className="text-2xl font-bold">My Orders</h1>
      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<Package className="h-8 w-8" />}
            title="No orders yet"
            description="Once you place an order, it will appear here."
            action={<Link to="/products" className="btn-orange rounded-full px-6 py-2 text-sm">Start Shopping</Link>}
          />
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="rounded-xl border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Order #{o._id.slice(-8)}</p>
                  <p className="text-sm">Placed on {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={o.status} />
                  <span className="text-lg font-bold">₹{o.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                {o.items.slice(0, 4).map((it, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="h-14 w-14 overflow-hidden rounded bg-muted">
                      {it.image && <img src={it.image} alt={it.title} className="h-full w-full object-cover" />}
                    </div>
                    <div className="text-sm">
                      <p className="line-clamp-1 max-w-[180px]">{it.title}</p>
                      <p className="text-xs text-muted-foreground">Qty: {it.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
