import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { SELLER_NAV } from "@/lib/nav";
import ProductForm, { type ProductFormValues } from "@/components/ProductForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "sonner";

export const Route = createFileRoute("/seller/products/edit/$id")({
  component: () => (
    <ProtectedRoute roles={["seller", "admin"]}>
      <DashboardLayout title="Seller" nav={SELLER_NAV}>
        <EditProductPage />
      </DashboardLayout>
    </ProtectedRoute>
  ),
});

function EditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<ProductFormValues | null>(null);

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
    <div className="max-w-3xl">
      <h1 className="mb-5 text-2xl font-bold">Edit Product</h1>
      <ProductForm
        initial={initial}
        submitLabel="Update Product"
        onSubmit={async (values) => {
          try {
            await api.put(`/products/${id}`, values);
            toast.success("Product updated");
            navigate({ to: "/seller/products" });
          } catch (err: any) {
            toast.error(err?.response?.data?.message || "Could not update");
          }
        }}
      />
    </div>
  );
}
