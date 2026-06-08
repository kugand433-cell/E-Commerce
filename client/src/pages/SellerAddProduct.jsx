import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { SELLER_NAV } from "@/lib/nav";
import ProductForm from "@/components/ProductForm";
import { toast } from "sonner";

export default function SellerAddProduct() {
  return (
    <ProtectedRoute roles={["seller", "admin"]}>
      <DashboardLayout title="Seller" nav={SELLER_NAV}>
        <AddProductPage />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function AddProductPage() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: '48rem' }}>
      <h1 style={{ marginBottom: '1.25rem', fontSize: '1.5rem', fontWeight: 700 }}>Add Product</h1>
      <ProductForm
        submitLabel="Create Product"
        onSubmit={async (values) => {
          try {
            await api.post("/products", values);
            toast.success("Product created");
            navigate("/seller/products");
          } catch (err) {
            toast.error(err?.response?.data?.message || "Could not create product");
          }
        }}
      />
    </div>
  );
}
