import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout, { StatCard } from "@/components/DashboardLayout";
import { ADMIN_NAV } from "@/lib/nav";
import { Users, Store, Package, ListOrdered, IndianRupee } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export const Route = createFileRoute("/admin/dashboard")({
  component: () => (
    <ProtectedRoute roles={["admin"]}>
      <DashboardLayout title="Admin" nav={ADMIN_NAV}>
        <AdminDashboard />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats")
      .then((r) => setStats(r.data?.data || r.data))
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  const s = stats || {};

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Platform Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Users" value={s.totalUsers ?? 0} icon={Users} />
        <StatCard label="Sellers" value={s.totalSellers ?? 0} icon={Store} accent="var(--info)" />
        <StatCard label="Products" value={s.totalProducts ?? 0} icon={Package} accent="var(--nest-yellow)" />
        <StatCard label="Orders" value={s.totalOrders ?? 0} icon={ListOrdered} accent="var(--warning)" />
        <StatCard label="Revenue" value={`₹${(s.totalRevenue ?? 0).toLocaleString()}`} icon={IndianRupee} accent="var(--success)" />
      </div>
      <div className="mt-6 rounded-xl border bg-card p-6 text-sm text-muted-foreground">
        Stats refresh on page load. Use the sidebar to manage users, products, and orders.
      </div>
    </div>
  );
}
