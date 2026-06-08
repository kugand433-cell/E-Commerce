import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout, { StatCard } from "@/components/DashboardLayout";
import { ADMIN_NAV } from "@/lib/nav";
import { Users, Store, Package, ListOrdered, IndianRupee } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AdminDashboard() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <DashboardLayout title="Admin" nav={ADMIN_NAV}>
        <AdminDashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function AdminDashboardContent() {
  const [stats, setStats] = useState(null);
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
      <h1 style={{ marginBottom: '1.25rem', fontSize: '1.5rem', fontWeight: 700 }}>Platform Overview</h1>
      <div className="grid-stats-5">
        <StatCard label="Users" value={s.totalUsers ?? 0} icon={Users} />
        <StatCard label="Sellers" value={s.totalSellers ?? 0} icon={Store} accent="var(--info)" />
        <StatCard label="Products" value={s.totalProducts ?? 0} icon={Package} accent="var(--nest-yellow)" />
        <StatCard label="Orders" value={s.totalOrders ?? 0} icon={ListOrdered} accent="var(--warning)" />
        <StatCard label="Revenue" value={`₹${(s.totalRevenue ?? 0).toLocaleString()}`} icon={IndianRupee} accent="var(--success)" />
      </div>
      <div style={{ marginTop: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
        Stats refresh on page load. Use the sidebar to manage users, products, and orders.
      </div>
    </div>
  );
}
