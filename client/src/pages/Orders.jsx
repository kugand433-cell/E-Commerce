import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import StatusBadge from "@/components/StatusBadge";
import { Package } from "lucide-react";

export default function Orders() {
  return (
    <ProtectedRoute><OrdersPage /></ProtectedRoute>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
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
    <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Orders</h1>
      {loading ? (
        <LoadingSpinner />
      ) : orders.length === 0 ? (
        <div style={{ marginTop: '1.5rem' }}>
          <EmptyState
            icon={<Package style={{ width: 32, height: 32 }} />}
            title="No orders yet"
            description="Once you place an order, it will appear here."
            action={<Link to="/products" className="btn-orange" style={{ borderRadius: '9999px', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>Start Shopping</Link>}
          />
        </div>
      ) : (
        <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {orders.map((o) => (
            <div key={o._id} style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>Order #{o._id.slice(-8)}</p>
                  <p style={{ fontSize: '0.875rem' }}>Placed on {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <StatusBadge status={o.status} />
                  <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>₹{o.totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flex: 1 }}>
                  {o.items.slice(0, 4).map((it, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '3.5rem', height: '3.5rem', overflow: 'hidden', borderRadius: '4px', backgroundColor: 'var(--muted)' }}>
                        {it.image && <img src={it.image} alt={it.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ fontSize: '0.875rem' }}>
                        <p style={{ maxWidth: '180px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.title}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Qty: {it.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to={`/orders/${o._id}`} className="btn-orange" style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.75rem' }}>
                  Track Package
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
