import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import StarRating from "./StarRating";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price;
  const off = hasDiscount ? Math.round(((product.price - price) / product.price) * 100) : 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border bg-card card-hover">
      <Link
        to="/products/$id"
        params={{ id: product._id }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-md bg-destructive px-2 py-0.5 text-xs font-semibold text-destructive-foreground">
            -{off}%
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        {product.brand && (
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        )}
        <Link
          to="/products/$id"
          params={{ id: product._id }}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-medium hover:text-nest-orange"
        >
          {product.title}
        </Link>
        <StarRating value={product.rating || 0} count={product.numReviews} />
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">₹{price.toLocaleString()}</span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            addItem(product);
            toast.success("Added to cart");
          }}
          className="btn-orange mt-1 inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-sm"
        >
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
}
