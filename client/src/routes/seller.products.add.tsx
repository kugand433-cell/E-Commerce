import { createFileRoute, useNavigate } from "@tanstack/react-router";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { SELLER_NAV } from "@/lib/nav";
import ProductForm from "@/components/ProductForm";
import { toast } from "sonner";

export const Route = createFileRoute("/seller/products/add")({
  component: () => (
    <ProtectedRoute roles={["seller", "admin"]}>
      <DashboardLayout title="Seller" nav={SELLER_NAV}>
        <AddProductPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

function AddProductPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl">
      <h1 className="mb-5 text-2xl font-bold">Add Product</h1>
      <ProductForm
        submitLabel="Create Product"
        onSubmit={async (values) => {
          try {
            await api.post("/products", values);
            toast.success("Product created");
            navigate({ to: "/seller/products" });
          } catch (err: any) {
            toast.error(err?.response?.data?.message || "Could not create product");
          }
        }}
      />
    </div>
  );
}
