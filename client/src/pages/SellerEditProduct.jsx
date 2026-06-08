import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { SELLER_NAV } from "@/lib/nav";
import ProductForm from "@/components/ProductForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

export default function SellerEditProduct() {
  return (
    <ProtectedRoute roles={["seller", "admin"]}>
      <DashboardLayout title="Seller" nav={SELLER_NAV}>
        <EditProductPage />
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((r) => {
        const p = r.data?.data || r.data?.product || r.data;
        if (!p) return;
        setInitial({
          title: p.title || "",
          description: p.description || "",
          price: p.price || 0,
          discountPrice: p.discountPrice || 0,
          stock: p.stock || 0,
          category: typeof p.category === "string" ? p.category : p.category?._id || "",
          brand: p.brand || "",
          tags: p.tags || [],
          specs: p.specs && typeof p.specs === "object" ? p.specs : {},
          images: p.images || [],
        });
      })
      .catch(() => toast.error("Could not load product"));
  }, [id]);

  if (!initial) return <LoadingSpinner />;

  return (
    <div style={{ maxWidth: '48rem' }}>
      <h1 style={{ marginBottom: '1.25rem', fontSize: '1.5rem', fontWeight: 700 }}>Edit Product</h1>
      <ProductForm
        initial={initial}
        submitLabel="Update Product"
        onSubmit={async (values) => {
          try {
            await api.put(`/products/${id}`, values);
            toast.success("Product updated");
            navigate("/seller/products");
          } catch (err) {
            toast.error(err?.response?.data?.message || "Could not update");
          }
        }}
      />
    </div>
  );
}
