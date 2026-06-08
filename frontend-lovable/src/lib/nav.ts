import { LayoutDashboard, Package, PlusSquare, ShoppingBag, Users, ListOrdered } from "lucide-react";
import type { NavItem } from "@/components/DashboardLayout";

export const SELLER_NAV: NavItem[] = [
  { to: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/seller/products", label: "My Products", icon: Package },
  { to: "/seller/products/add", label: "Add Product", icon: PlusSquare },
  { to: "/seller/orders", label: "Orders", icon: ShoppingBag },
];

export const ADMIN_NAV: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "All Users", icon: Users },
  { to: "/admin/products", label: "All Products", icon: Package },
  { to: "/admin/orders", label: "All Orders", icon: ListOrdered },
];
