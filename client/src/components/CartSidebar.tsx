import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Link } from "@tanstack/react-router";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, count } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={closeCart}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag className="h-5 w-5" /> Your Cart ({count})
          </h3>
          <button onClick={closeCart} className="rounded p-1 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="mb-3 h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted-foreground">Add items to get started</p>
            <button onClick={closeCart} className="btn-orange mt-4 rounded-full px-5 py-2 text-sm">
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((it) => (
                <div key={it.product} className="flex gap-3 rounded-lg border p-2">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-muted">
                    {it.image && <img src={it.image} alt={it.title} className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium">{it.title}</p>
                    <p className="mt-1 text-sm font-bold">₹{it.price.toLocaleString()}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center rounded border">
                        <button onClick={() => updateQuantity(it.product, it.quantity - 1)} className="p-1 hover:bg-muted">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{it.quantity}</span>
                        <button onClick={() => updateQuantity(it.product, it.quantity + 1)} className="p-1 hover:bg-muted">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(it.product)} className="ml-auto p-1 text-destructive hover:bg-muted rounded">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t bg-secondary/50 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <Link
                to="/cart"
                onClick={closeCart}
                className="block w-full rounded-md border bg-card py-2 text-center text-sm font-medium hover:bg-muted"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="btn-orange block w-full rounded-md py-2.5 text-center text-sm"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
