import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import EmptyState from "@/components/EmptyState";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title="Your cart is empty"
          description="Browse products and add items to your cart."
          action={<Link to="/products" className="btn-orange rounded-full px-6 py-2 text-sm">Shop Now</Link>}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <h1 className="text-2xl font-bold">Shopping Cart</h1>
      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.product} className="flex gap-4 rounded-xl border bg-card p-4">
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded bg-muted">
                {it.image && <img src={it.image} alt={it.title} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1">
                <Link to="/products/$id" params={{ id: it.product }} className="font-medium hover:text-nest-orange">
                  {it.title}
                </Link>
                <p className="mt-1 text-lg font-bold">₹{it.price.toLocaleString()}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded border">
                    <button onClick={() => updateQuantity(it.product, it.quantity - 1)} className="p-1.5 hover:bg-muted"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-10 text-center text-sm">{it.quantity}</span>
                    <button onClick={() => updateQuantity(it.product, it.quantity + 1)} className="p-1.5 hover:bg-muted"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <button onClick={() => removeItem(it.product)} className="inline-flex items-center gap-1 text-sm text-destructive hover:underline">
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
              <div className="text-right text-lg font-bold">
                ₹{(it.price * it.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <aside className="self-start rounded-xl border bg-card p-5 lg:sticky lg:top-32">
          <h3 className="font-semibold">Order Summary</h3>
          <div className="mt-3 space-y-2 text-sm">
            <Row label={`Subtotal (${items.length} items)`} value={`₹${subtotal.toLocaleString()}`} />
            <Row label="Shipping" value="FREE" />
            <Row label="Tax" value="Calculated at checkout" />
          </div>
          <hr className="my-3" />
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-xl font-bold">₹{subtotal.toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="btn-orange mt-4 block rounded-full py-2.5 text-center text-sm">
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>
  );
}
