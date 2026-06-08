import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout, { StatCard } from "@/components/DashboardLayout";
import { SELLER_NAV } from "@/lib/nav";
import { Package, ShoppingBag, IndianRupee, Star } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function SellerDashboard() {
  return (
    <ProtectedRoute roles={["seller", "admin"]}>
      <DashboardLayout title="Seller" nav={SELLER_NAV}>
        <SellerDashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function SellerDashboardContent() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, rating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products/seller/mine").then((r) => r.data?.data || r.data?.products || r.data || []).catch(() => []),
      api.get("/orders/seller/mine").then((r) => r.data?.data || r.data?.orders || r.data || []).catch(() => []),
    ]).then(([products, orders]) => {
      const productsArr = Array.isArray(products) ? products : products?.products || [];
      const ordersArr = Array.isArray(orders) ? orders : orders?.orders || [];
      const revenue = ordersArr.reduce((s, o) => s + (o.totalPrice || 0), 0);
      const avgRating = productsArr.length
        ? productsArr.reduce((s, p) => s + (p.rating || 0), 0) / productsArr.length
        : 0;
      setStats({ products: productsArr.length, orders: ordersArr.length, revenue, rating: avgRating });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 style={{ marginBottom: '1.25rem', fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h1>
      <div className="grid-stats-4">
        <StatCard label="Products" value={stats.products} icon={Package} />
        <StatCard label="Orders" value={stats.orders} icon={ShoppingBag} accent="var(--info)" />
        <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={IndianRupee} accent="var(--success)" />
        <StatCard label="Avg Rating" value={stats.rating.toFixed(1)} icon={Star} accent="var(--nest-yellow)" />
      </div>
      <div style={{ marginTop: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
        Welcome to your seller dashboard. Use the menu to manage your products and orders.
      </div>
    </div>
  );
}
