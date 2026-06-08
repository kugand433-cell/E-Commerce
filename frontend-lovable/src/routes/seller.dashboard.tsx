import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout, { StatCard } from "@/components/DashboardLayout";
import { SELLER_NAV } from "@/lib/nav";
import { Package, ShoppingBag, IndianRupee, Star } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export const Route = createFileRoute("/seller/dashboard")({
  component: () => (
    <ProtectedRoute roles={["seller", "admin"]}>
      <DashboardLayout title="Seller" nav={SELLER_NAV}>
        <SellerDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

function SellerDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, rating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/products/seller/mine").then((r) => r.data?.data || r.data?.products || r.data || []).catch(() => []),
      api.get("/orders/mine").then((r) => r.data?.data || r.data?.orders || r.data || []).catch(() => []),
    ]).then(([products, orders]: any) => {
      const productsArr = Array.isArray(products) ? products : products?.products || [];
      const ordersArr = Array.isArray(orders) ? orders : orders?.orders || [];
      const revenue = ordersArr.reduce((s: number, o: any) => s + (o.totalPrice || 0), 0);
      const avgRating = productsArr.length
        ? productsArr.reduce((s: number, p: any) => s + (p.rating || 0), 0) / productsArr.length
        : 0;
      setStats({ products: productsArr.length, orders: ordersArr.length, revenue, rating: avgRating });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={stats.products} icon={Package} />
        <StatCard label="Orders" value={stats.orders} icon={ShoppingBag} accent="var(--info)" />
        <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={IndianRupee} accent="var(--success)" />
        <StatCard label="Avg Rating" value={stats.rating.toFixed(1)} icon={Star} accent="var(--nest-yellow)" />
      </div>
      <div className="mt-6 rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        Welcome to your seller dashboard. Use the menu to manage your products and orders.
      </div>
    </div>
  );
}
