import { LayoutDashboard, Package, PlusSquare, ShoppingBag, Users, ListOrdered } from "lucide-react";

export const SELLER_NAV = [
  { to: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/seller/products", label: "My Products", icon: Package },
  { to: "/seller/products/add", label: "Add Product", icon: PlusSquare },
  { to: "/seller/orders", label: "Orders", icon: ShoppingBag },
];

export const ADMIN_NAV = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "All Users", icon: Users },
  { to: "/admin/products", label: "All Products", icon: Package },
  { to: "/admin/orders", label: "All Orders", icon: ListOrdered },
];
