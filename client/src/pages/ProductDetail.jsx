import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import StarRating from "@/components/StarRating";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ShoppingCart, Zap, ShieldCheck, Truck, Star } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem, openCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);

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
    <div style={{ maxWidth: '28rem', margin: '0 auto', padding: '5rem 0', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Product not found</h2>
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

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error("Please sign in to leave a review");
    try {
      await api.post(`/reviews/${id}`, newReview);
      toast.success("Review submitted");
      setNewReview({ rating: 5, comment: "" });
      const r = await api.get(`/reviews/${id}`);
      setReviews(r.data?.data || r.data?.reviews || r.data || []);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not submit review");
    }
  };

  const inputStyle = { width: '100%', borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', padding: '0.375rem 0.5rem', fontSize: '0.875rem' };

  return (
    <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div className="grid-product-detail">
        {/* Gallery */}
        <div>
          <div style={{ aspectRatio: '1/1', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
            {product.images?.[activeImg] ? (
              <img src={product.images[activeImg]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem' }} />
            ) : (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--muted-foreground)' }}>No image</div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{ width: '4rem', height: '4rem', flexShrink: 0, overflow: 'hidden', borderRadius: '4px', border: `2px solid ${i === activeImg ? 'var(--nest-orange)' : 'transparent'}`, background: 'none', padding: 0, cursor: 'pointer' }}
                >
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.brand && <p style={{ fontSize: '0.875rem', color: 'var(--nest-link)' }}>{product.brand}</p>}
          <h1 style={{ marginTop: '0.25rem', fontSize: '1.5rem', fontWeight: 700 }}>{product.title}</h1>
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <StarRating value={product.rating || 0} count={product.numReviews} showValue />
          </div>
          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid var(--border)' }} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            {hasDiscount && <span style={{ borderRadius: '4px', backgroundColor: 'var(--destructive)', padding: '0.125rem 0.5rem', fontSize: '0.875rem', fontWeight: 700, color: 'var(--destructive-foreground)' }}>-{off}%</span>}
            <span style={{ fontSize: '2.25rem', fontWeight: 800 }}>₹{price.toLocaleString()}</span>
            {hasDiscount && <span style={{ fontSize: '1rem', color: 'var(--muted-foreground)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span>}
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: product.stock > 0 ? '#15803d' : 'var(--destructive)' }}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of stock"}
          </p>
          <p style={{ marginTop: '1rem', whiteSpace: 'pre-line', fontSize: '0.875rem', lineHeight: 1.625, color: 'rgba(26,26,46,0.9)' }}>{product.description}</p>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Specifications</h3>
              <table style={{ width: '100%', overflow: 'hidden', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                <tbody>
                  {Object.entries(product.specs).map(([k, v], i) => (
                    <tr key={k} style={{ borderBottom: '1px solid var(--border)', backgroundColor: i % 2 === 1 ? 'rgba(237,236,230,0.4)' : 'transparent' }}>
                      <td style={{ width: '33%', padding: '0.5rem 0.75rem', fontWeight: 500, color: 'var(--muted-foreground)' }}>{k}</td>
                      <td style={{ padding: '0.5rem 0.75rem' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Buy box */}
        <aside style={{ alignSelf: 'flex-start', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem', position: 'sticky', top: '8rem' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>₹{price.toLocaleString()}</div>
          <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
            <Truck style={{ width: 16, height: 16 }} /> FREE delivery
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <label>Qty:</label>
            <select
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              style={{ borderRadius: '4px', border: '1px solid var(--border)', backgroundColor: 'var(--background)', padding: '0.25rem 0.5rem' }}
              disabled={product.stock <= 0}
            >
              {Array.from({ length: Math.min(product.stock || 10, 10) }).map((_, i) => (
                <option key={i} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
          <button onClick={handleAdd} disabled={product.stock <= 0} className="btn-orange" style={{ marginTop: '1rem', width: '100%', borderRadius: '9999px', padding: '0.625rem', fontSize: '0.875rem' }}>
            <ShoppingCart style={{ width: 16, height: 16, marginRight: '0.5rem', display: 'inline' }} /> Add to Cart
          </button>
          <button onClick={handleAdd} disabled={product.stock <= 0} style={{ marginTop: '0.5rem', width: '100%', borderRadius: '9999px', backgroundColor: 'var(--nest-orange-hover)', padding: '0.625rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--nest-navy)', border: 'none', cursor: 'pointer', opacity: product.stock <= 0 ? 0.5 : 1 }}>
            <Zap style={{ width: 16, height: 16, marginRight: '0.5rem', display: 'inline' }} /> Buy Now
          </button>
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
            <ShieldCheck style={{ width: 16, height: 16 }} /> Secure transaction
          </div>
        </aside>
      </div>

      {/* Reviews */}
      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Customer Reviews</h2>
        <div className="grid-review-layout" style={{ marginTop: '1rem' }}>
          <form onSubmit={submitReview} style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1rem' }}>
            <h3 style={{ fontWeight: 600 }}>Write a review</h3>
             <div style={{ marginTop: '0.75rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Rating</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.25rem' }} onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((num) => {
                    const isFilled = hoverRating > 0 ? num <= hoverRating : num <= newReview.rating;
                    const ratingLabels = { 5: "Excellent", 4: "Good", 3: "Average", 2: "Below Average", 1: "Poor" };
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: num })}
                        onMouseEnter={() => setHoverRating(num)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          outline: 'none',
                        }}
                      >
                        <Star
                          style={{
                            width: 28,
                            height: 28,
                            color: isFilled ? 'var(--nest-orange)' : 'rgba(107,107,123,0.4)',
                            fill: isFilled ? 'var(--nest-orange)' : 'none',
                            transition: 'color 0.15s ease, fill 0.15s ease',
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--nest-orange)' }}>
                  {hoverRating > 0
                    ? `${hoverRating} Stars (${{ 5: "Excellent", 4: "Good", 3: "Average", 2: "Below Average", 1: "Poor" }[hoverRating]})`
                    : `${newReview.rating} Stars (${{ 5: "Excellent", 4: "Good", 3: "Average", 2: "Below Average", 1: "Poor" }[newReview.rating]})`}
                </span>
              </div>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <label style={{ fontSize: '0.875rem' }}>Comment</label>
              <textarea rows={4} required value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} style={{ ...inputStyle, marginTop: '0.25rem' }} />
            </div>
            <button className="btn-orange" style={{ marginTop: '0.75rem', width: '100%', borderRadius: '6px', padding: '0.5rem', fontSize: '0.875rem' }}>Submit Review</button>
          </form>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {reviews.length === 0 ? (
              <p style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((r) => (
                <div key={r._id} style={{ borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 500 }}>{typeof r.user === "object" ? r.user.name : "Customer"}</div>
                    <StarRating value={r.rating} />
                  </div>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
