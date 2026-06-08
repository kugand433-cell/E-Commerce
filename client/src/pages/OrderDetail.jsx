import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "@/components/StatusBadge";

export default function OrderDetail() {
  return <ProtectedRoute><OrderDetailPage /></ProtectedRoute>;
}

function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`)
      .then((r) => setOrder(r.data?.data || r.data?.order || r.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) return <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '5rem 0', textAlign: 'center' }}><h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Order not found</h2></div>;

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Order #{order._id.slice(-8)}</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div style={{ marginTop: '1.25rem', display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Shipping Address</h3>
          <p style={{ fontSize: '0.875rem' }}>
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
            {order.shippingAddress.country}
          </p>
        </div>
        <div style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Payment</h3>
          <p style={{ fontSize: '0.875rem' }}>Method: {order.paymentMethod}</p>
          <p style={{ fontSize: '0.875rem' }}>Status: {order.isPaid ? "Paid" : "Pending"}</p>
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1rem' }}>
        <h3 style={{ marginBottom: '0.75rem', fontWeight: 600 }}>Items</h3>
        <div>
          {order.items.map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: '4rem', height: '4rem', overflow: 'hidden', borderRadius: '4px', backgroundColor: 'var(--muted)' }}>
                {it.image && <img src={it.image} alt={it.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500 }}>{it.title}</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>Qty: {it.quantity}</p>
              </div>
              <div style={{ fontWeight: 600 }}>₹{(it.price * it.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
          <span style={{ fontWeight: 600 }}>Total</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{order.totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
