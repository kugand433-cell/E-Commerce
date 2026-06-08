import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import StarRating from "./StarRating";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const off = hasDiscount ? Math.round(((product.price - price) / product.price) * 100) : 0;

  return (
    <div className="card-hover" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
      <Link
        to={`/products/${product._id}`}
        style={{ position: 'relative', display: 'block', aspectRatio: '1/1', overflow: 'hidden', backgroundColor: 'var(--muted)' }}
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="group-hover-scale"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
          />
        ) : (
          <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
            No image
          </div>
        )}
        {hasDiscount && (
          <span style={{ position: 'absolute', left: '0.5rem', top: '0.5rem', borderRadius: '6px', backgroundColor: 'var(--destructive)', padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--destructive-foreground)' }}>
            -{off}%
          </span>
        )}
      </Link>
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '0.5rem', padding: '0.75rem' }}>
        {product.brand && (
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.025em', color: 'var(--muted-foreground)' }}>{product.brand}</p>
        )}
        <Link
          to={`/products/${product._id}`}
          style={{ minHeight: '2.5rem', fontSize: '0.875rem', fontWeight: 500, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {product.title}
        </Link>
        <StarRating value={product.rating || 0} count={product.numReviews} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>₹{price.toLocaleString()}</span>
          {hasDiscount && (
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textDecoration: 'line-through' }}>
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            addItem(product);
            toast.success("Added to cart");
          }}
          className="btn-orange"
          style={{ marginTop: '0.25rem', borderRadius: '9999px', padding: '0.375rem 0.75rem', fontSize: '0.875rem' }}
        >
          <ShoppingCart style={{ width: 16, height: 16 }} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
