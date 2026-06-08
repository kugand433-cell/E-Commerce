import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Role, User } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { ADMIN_NAV } from "@/lib/nav";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <ProtectedRoute roles={["admin"]}>
      <DashboardLayout title="Admin" nav={ADMIN_NAV}>
        <AllUsers />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get("/admin/users")
      .then((r) => {
        const data = r.data?.data?.users || r.data?.users || r.data?.data || r.data;
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const changeRole = async (id: string, role: Role) => {
    try { await api.put(`/admin/users/${id}/role`, { role }); toast.success("Role updated"); load(); }
    catch (err: any) { toast.error(err?.response?.data?.message || "Failed"); }
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    try { await api.delete(`/admin/users/${id}`); toast.success("User deleted"); load(); }
    catch (err: any) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">All Users</h1>
      {loading ? <LoadingSpinner /> : users.length === 0 ? <EmptyState title="No users found" /> : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-muted-foreground">{u.email}</td>
                  <td className="p-3">
                    <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value as Role)} className="rounded border bg-background px-2 py-1 text-xs">
                      <option value="customer">customer</option>
                      <option value="seller">seller</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="p-3 text-muted-foreground">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => remove(u._id)} className="rounded p-1.5 text-destructive hover:bg-muted">
                      <Trash2 className="h-4 w-4" />
                    </button>
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
