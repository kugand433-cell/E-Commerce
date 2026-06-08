import { Navigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import type { Role } from "@/lib/types";
import type { ReactNode } from "react";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: Role[];
}) {
  const { isAuthenticated, user, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (loading) return <LoadingSpinner label="Checking session…" />;

  if (!isAuthenticated) {
    return <Navigate to="/login" search={{ redirect: pathname }} replace />;
  }

  if (roles && roles.length > 0 && (!user || !roles.includes(user.role))) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h2 className="text-2xl font-bold">Access Denied</h2>
        <p className="mt-2 text-muted-foreground">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
