import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { ADMIN_NAV } from "@/lib/nav";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsers() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <DashboardLayout title="Admin" nav={ADMIN_NAV}>
        <AllUsers />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function AllUsers() {
  const [users, setUsers] = useState([]);
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

  const changeRole = async (id, role) => {
    try { await api.put(`/admin/users/${id}/role`, { role }); toast.success("Role updated"); load(); }
    catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
  };
  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    try { await api.delete(`/admin/users/${id}`); toast.success("User deleted"); load(); }
    catch (err) { toast.error(err?.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.25rem', fontSize: '1.5rem', fontWeight: 700 }}>All Users</h1>
      {loading ? <LoadingSpinner /> : users.length === 0 ? <EmptyState title="No users found" /> : (
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          <table className="table-auto">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{u.email}</td>
                  <td>
                    <select value={u.role} onChange={(e) => changeRole(u._id, e.target.value)} style={{ borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                      <option value="customer">customer</option>
                      <option value="seller">seller</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td style={{ color: 'var(--muted-foreground)' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button onClick={() => remove(u._id)} style={{ padding: '0.375rem', borderRadius: '4px', color: 'var(--destructive)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 style={{ width: 16, height: 16 }} />
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
