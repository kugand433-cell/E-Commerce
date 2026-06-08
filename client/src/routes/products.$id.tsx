import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Product, Review } from "@/lib/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import StarRating from "@/components/StarRating";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ShoppingCart, Zap, ShieldCheck, Truck } from "lucide-react";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { addItem, openCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/products/${id}`).then((r) => r.data?.data || r.data?.product || r.data).catch(() => null),
      api.get(`/reviews/${id}`).then((r) => r.data?.data || r.data?.reviews || r.data).catch(() => []),
    ]).then(([p, rv]) => {
      setProduct(p);
      setReviews(Array.isArray(rv) ? rv : []);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!product) return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h2 className="text-xl font-bold">Product not found</h2>
    </div>
  );

  const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const off = hasDiscount ? Math.round(((product.price - price) / product.price) * 100) : 0;

  const handleAdd = () => {
    addItem(product, qty);
    toast.success("Added to cart");
    openCart();
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error("Please sign in to leave a review");
    try {
      await api.post(`/reviews/${id}`, newReview);
      toast.success("Review submitted");
      setNewReview({ rating: 5, comment: "" });
      const r = await api.get(`/reviews/${id}`);
      setReviews(r.data?.data || r.data?.reviews || r.data || []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Could not submit review");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="grid gap-8 md:grid-cols-[1fr_1.2fr] lg:grid-cols-[1fr_1.2fr_320px]">
        {/* Gallery */}
        <div>
          <div className="aspect-square overflow-hidden rounded-xl border bg-card">
            {product.images?.[activeImg] ? (
              <img src={product.images[activeImg]} alt={product.title} className="h-full w-full object-contain p-4" />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded border-2 ${i === activeImg ? "border-nest-orange" : "border-transparent"}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand && <p className="text-sm text-nest-link">{product.brand}</p>}
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">{product.title}</h1>
          <div className="mt-2 flex items-center gap-3">
            <StarRating value={product.rating || 0} count={product.numReviews} showValue />
          </div>
          <hr className="my-4" />
          <div className="flex items-baseline gap-3">
            {hasDiscount && <span className="rounded bg-destructive px-2 py-0.5 text-sm font-bold text-destructive-foreground">-{off}%</span>}
            <span className="text-4xl font-extrabold">₹{price.toLocaleString()}</span>
            {hasDiscount && <span className="text-base text-muted-foreground line-through">₹{product.price.toLocaleString()}</span>}
          </div>
          <p className={`mt-2 text-sm font-semibold ${product.stock > 0 ? "text-green-700" : "text-destructive"}`}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of stock"}
          </p>

          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/90">{product.description}</p>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-6">
              <h3 className="mb-2 font-semibold">Specifications</h3>
              <table className="w-full overflow-hidden rounded-lg border text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([k, v]) => (
                    <tr key={k} className="border-b last:border-b-0 even:bg-muted/40">
                      <td className="w-1/3 px-3 py-2 font-medium text-muted-foreground">{k}</td>
                      <td className="px-3 py-2">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Buy box */}
        <aside className="self-start rounded-xl border bg-card p-5 lg:sticky lg:top-32">
          <div className="text-2xl font-bold">₹{price.toLocaleString()}</div>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Truck className="h-4 w-4" /> FREE delivery
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm">
            <label>Qty:</label>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="rounded border bg-background px-2 py-1"
              disabled={product.stock <= 0}
            >
              {Array.from({ length: Math.min(product.stock || 10, 10) }).map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className="btn-orange mt-4 w-full rounded-full py-2.5 text-sm disabled:opacity-50"
          >
            <ShoppingCart className="mr-2 inline h-4 w-4" /> Add to Cart
          </button>
          <button
            onClick={() => { handleAdd(); }}
            disabled={product.stock <= 0}
            className="mt-2 w-full rounded-full bg-nest-orange-hover py-2.5 text-sm font-semibold text-nest-navy disabled:opacity-50"
          >
            <Zap className="mr-2 inline h-4 w-4" /> Buy Now
          </button>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" /> Secure transaction
          </div>
        </aside>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-xl font-bold">Customer Reviews</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-[1fr_2fr]">
          <form onSubmit={submitReview} className="rounded-xl border bg-card p-4">
            <h3 className="font-semibold">Write a review</h3>
            <div className="mt-3">
              <label className="text-sm">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                className="mt-1 w-full rounded border bg-background px-2 py-1.5 text-sm"
              >
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Stars</option>)}
              </select>
            </div>
            <div className="mt-3">
              <label className="text-sm">Comment</label>
              <textarea
                rows={4}
                required
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="mt-1 w-full rounded border bg-background px-2 py-1.5 text-sm"
              />
            </div>
            <button className="btn-orange mt-3 w-full rounded-md py-2 text-sm">Submit Review</button>
          </form>
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="rounded-xl border bg-card p-6 text-center text-sm text-muted-foreground">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((r) => (
                <div key={r._id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{typeof r.user === "object" ? r.user.name : "Customer"}</div>
                    <StarRating value={r.rating} />
                  </div>
                  <p className="mt-2 text-sm">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
