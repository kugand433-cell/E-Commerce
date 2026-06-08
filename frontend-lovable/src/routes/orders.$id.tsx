import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Order } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";

export const Route = createFileRoute("/orders/$id")({
  component: () => <ProtectedRoute><OrderDetail /></ProtectedRoute>,
});

function OrderDetail() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((r) => setOrder(r.data?.data || r.data?.order || r.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <div className="mx-auto max-w-md py-20 text-center"><h2 className="text-xl font-bold">Order not found</h2></div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Order #{order._id.slice(-8)}</h1>
          <p className="text-sm text-muted-foreground">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-4">
          <h3 className="mb-2 font-semibold">Shipping Address</h3>
          <p className="text-sm">
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
            {order.shippingAddress.country}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <h3 className="mb-2 font-semibold">Payment</h3>
          <p className="text-sm">Method: {order.paymentMethod}</p>
          <p className="text-sm">Status: {order.isPaid ? "Paid" : "Pending"}</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border bg-card p-4">
        <h3 className="mb-3 font-semibold">Items</h3>
        <div className="divide-y">
          {order.items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 py-3">
              <div className="h-16 w-16 overflow-hidden rounded bg-muted">
                {it.image && <img src={it.image} alt={it.title} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-medium">{it.title}</p>
                <p className="text-sm text-muted-foreground">Qty: {it.quantity}</p>
              </div>
              <div className="font-semibold">₹{(it.price * it.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t pt-3">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold">₹{order.totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
