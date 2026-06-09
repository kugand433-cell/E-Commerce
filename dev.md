# ShopNest — Developer Task Board

> **Workflow:** Do 5 tasks → take a break → test what you built → do the next 5. Repeat.
> Each task has an exact file, an exact fix, and a test to confirm it works.

---

## Legend

| Priority | Meaning |
|---|---|
| 🔴 Critical | App is broken or data is wrong |
| 🟠 High | Users notice and are blocked |
| 🟡 Medium | Annoying but workable |
| 🟢 Low | Polish and trust signals |

---

## 🏁 Sprint 1 — Do these 5, then stop and test

---

### Task 1 — Fix the `seller/mine` route ordering bug
**Priority:** 🔴 Critical  
**Files:** `server/routes/productRoutes.js`, `server/routes/orderRoutes.js`

**Problem:** Express registers `GET /:id` before `GET /seller/mine`. When a seller hits `/products/seller/mine`, Express matches `"seller"` as the `:id` param and throws a Mongoose CastError. The seller dashboard always shows 0 products and 0 orders because both calls fail silently.

**Fix — `productRoutes.js`:**

```js
// BEFORE (wrong order)
router.get('/', getProducts);
router.get('/:id', getProductById);         // ← catches "seller" first
router.get('/seller/mine', verifyToken, roleGuard('seller'), getMyProducts);

// AFTER (correct order — static paths before dynamic)
router.get('/', getProducts);
router.get('/seller/mine', verifyToken, roleGuard('seller'), getMyProducts); // ← must be first
router.get('/:id', getProductById);
```

**Fix — `orderRoutes.js`:**

```js
// BEFORE
router.get('/:id', verifyToken, getOrderById);
router.get('/seller/mine', verifyToken, roleGuard('seller'), getSellerOrders);

// AFTER
router.get('/seller/mine', verifyToken, roleGuard('seller'), getSellerOrders); // ← first
router.get('/:id', verifyToken, getOrderById);
```

**Test:** Log in as a seller → go to `/seller/dashboard` → stats should show real numbers, not zeros.

---

### Task 2 — Fix the account dropdown in the Navbar
**Priority:** 🔴 Critical  
**File:** `client/src/components/Navbar.jsx`

**Problem:** The account dropdown wrapper div has `display: 'none'` as an inline style. Inline styles always override CSS class rules, so the `group:hover` CSS never fires and the dropdown is permanently invisible.

**Fix — find this block (around line 57) and remove the inline `display: 'none'`:**

```jsx
// BEFORE
{isAuthenticated ? (
  <div className="group" style={{ position: 'relative', display: 'none' }}>

// AFTER
{isAuthenticated ? (
  <div className="group" style={{ position: 'relative' }}>
```

**Test:** Log in → hover over the "Hello, [Name]" button in the navbar → a dropdown should appear with "My Orders", "Sign out", and optionally "Seller/Admin Dashboard".

---

### Task 3 — Fix silent auth failure on expired tokens
**Priority:** 🟠 High  
**File:** `client/src/context/AuthContext.jsx`

**Problem:** When the app loads with an expired token in localStorage, the `/auth/me` call fails but the error is caught and swallowed. The user appears logged in but every protected API call will silently fail.

**Fix — update the `.catch()` in the `useEffect`:**

```jsx
// BEFORE
api.get("/auth/me")
  .then((res) => {
    const fresh = res.data?.data || res.data?.user || res.data;
    if (fresh) {
      setUser(fresh);
      localStorage.setItem("user", JSON.stringify(fresh));
    }
  })
  .catch(() => {})          // ← silently swallows expired token
  .finally(() => setLoading(false));

// AFTER
api.get("/auth/me")
  .then((res) => {
    const fresh = res.data?.data || res.data?.user || res.data;
    if (fresh) {
      setUser(fresh);
      localStorage.setItem("user", JSON.stringify(fresh));
    }
  })
  .catch((err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  })
  .finally(() => setLoading(false));
```

**Test:** Manually set a fake/expired token in localStorage → refresh the page → you should be logged out (navbar shows "Sign in"), not stuck in a broken authenticated state.

---

### Task 4 — Fix product specs losing data on edit
**Priority:** 🔴 Critical  
**File:** `server/models/Product.js`

**Problem:** Mongoose `Map` fields don't serialize to plain JSON by default. When a product is loaded for editing, `specs` may come back as a Mongoose Map object. `Object.entries()` on a Map returns nothing, so all specs silently disappear when the seller saves the form.

**Fix — add `toJSON` option to the product schema:**

```js
// server/models/Product.js
const productSchema = new mongoose.Schema({
  // ...all existing fields unchanged...
}, {
  timestamps: true,
  toJSON: { getters: true },    // ← add this
  toObject: { getters: true },  // ← and this
});
```

**Also fix `SellerEditProduct.jsx`** — when building the `initial` state, cast specs to a plain object defensively:

```jsx
// In the .then() callback, change:
specs: p.specs && typeof p.specs === "object" ? p.specs : {},

// To:
specs: p.specs ? Object.fromEntries(
  p.specs instanceof Map ? p.specs : Object.entries(p.specs)
) : {},
```

**Test:** Create a product with 2–3 specs → go to Edit Product → specs should all be visible and editable → save → check they persisted.

---

### Task 5 — Replace `window.confirm()` with sonner toast undo pattern
**Priority:** 🟠 High  
**Files:** `client/src/pages/SellerProducts.jsx`, `client/src/pages/AdminProducts.jsx`, `client/src/pages/AdminUsers.jsx`

**Problem:** `window.confirm()` blocks the JS event loop, looks out of place in a React SPA, and is blocked inside some browser sandboxes and iframe environments.

**Fix — create a reusable delete handler pattern. Replace the `remove` function in each file:**

```jsx
// SellerProducts.jsx — replace the remove function
const remove = async (id) => {
  toast("Delete this product?", {
    action: {
      label: "Delete",
      onClick: async () => {
        try {
          await api.delete(`/products/${id}`);
          toast.success("Product deleted");
          load();
        } catch (err) {
          toast.error(err?.response?.data?.message || "Delete failed");
        }
      },
    },
    cancel: { label: "Cancel", onClick: () => {} },
  });
};
```

Apply the same pattern to `AdminProducts.jsx` (for products) and `AdminUsers.jsx` (for users). Just change the message and the API endpoint.

**Test:** In Seller Products, click the trash icon → a toast should appear at the top-right with "Delete" and "Cancel" buttons — no browser dialog.

---

## ✅ Sprint 1 Test Checklist

Before moving to Sprint 2, verify all of these:

- [ ] Seller dashboard shows real product and order counts (not zeros)
- [ ] Account dropdown appears on hover in the navbar when logged in
- [ ] Putting a bad token in localStorage and refreshing logs you out cleanly
- [ ] Creating a product with specs, editing it, specs are still there
- [ ] Delete buttons show a toast confirmation, not a browser popup

---

## 🏁 Sprint 2 — Do these 5, then stop and test

---

### Task 6 — Standardise API response shapes
**Priority:** 🟠 High  
**Files:** `server/controllers/adminController.js`, and all frontend pages that consume admin routes

**Problem:** Some controllers return `{ success, data: array }` and some return `{ success, data: { users } }`. The frontend has fragile 4-level fallback chains (`r.data?.data?.users || r.data?.users || r.data?.data || r.data`) that quietly unwrap the wrong thing.

**Fix — pick one shape and use it everywhere. Use this pattern in all controllers:**

```js
// Consistent shape for collections
res.json({ success: true, data: users });      // for lists — array directly under data
res.json({ success: true, data: product });    // for single items
```

**Then simplify all frontend fetch handlers:**

```jsx
// AdminUsers.jsx — simplify the load function
api.get("/admin/users")
  .then((r) => {
    const data = r.data?.data;
    setUsers(Array.isArray(data) ? data : []);
  })
  .catch(() => setUsers([]))
  .finally(() => setLoading(false));

// Apply the same pattern to AdminProducts.jsx, AdminOrders.jsx,
// SellerProducts.jsx, SellerOrders.jsx, SellerDashboard.jsx
```

**Test:** Open Admin → Users, Admin → Products, Admin → Orders pages. All tables should load with real data and no console errors about undefined.

---

### Task 7 — Fix the redirect after login
**Priority:** 🟠 High  
**File:** `client/src/pages/Login.jsx`

**Problem:** When a user goes to `/orders` while logged out, they're redirected to `/login?redirect=%2Forders`. After logging in, the redirect param is ignored and they land on `/` instead of `/orders`.

**Fix — update the `submit` function in `Login.jsx`:**

```jsx
// BEFORE
const target = redirect ||
  (u.role === "admin" ? "/admin/dashboard" :
   u.role === "seller" ? "/seller/dashboard" : "/");

// AFTER — always prefer the redirect param first
const target = redirect
  ? decodeURIComponent(redirect)
  : u.role === "admin"
  ? "/admin/dashboard"
  : u.role === "seller"
  ? "/seller/dashboard"
  : "/";
```

**Test:** Log out → manually navigate to `/orders` → you're redirected to `/login?redirect=%2Forders` → log in → you should land on `/orders`, not the homepage.

---

### Task 8 — Fix checkout address never pre-filling
**Priority:** 🟡 Medium  
**File:** `client/src/pages/Checkout.jsx`

**Problem:** `Checkout.jsx` reads `user?.address` for default values but the JWT payload only contains `id` and `role` — there is no `address` field. The shipping form is always empty even if the user has saved their address.

**Fix — fetch the full user profile on mount:**

```jsx
// Checkout.jsx — add a useEffect to fetch full profile
import { useEffect, useState } from "react";
import api from "@/lib/api";

function CheckoutPage() {
  const { user } = useAuth();
  const [address, setAddress] = useState({
    street: "", city: "", state: "", pincode: "", country: "India",
  });

  useEffect(() => {
    api.get("/auth/me")
      .then((res) => {
        const profile = res.data?.data || res.data;
        if (profile?.address?.street) {
          setAddress({
            street: profile.address.street || "",
            city: profile.address.city || "",
            state: profile.address.state || "",
            pincode: profile.address.pincode || "",
            country: profile.address.country || "India",
          });
        }
      })
      .catch(() => {});
  }, []);

  // rest of the component unchanged...
```

**Test:** Go to your account profile and ensure the address is saved in the DB → log in → go to `/checkout` → the shipping address fields should be pre-filled.

---

### Task 9 — Fix `-0%` discount badge on product cards
**Priority:** 🟢 Low  
**File:** `client/src/components/ProductCard.jsx`

**Problem:** When a seller sets `discountPrice` equal to `price`, the `off` calculation rounds to `0`. A "-0%" badge still renders on the card, which looks broken.

**Fix — add an `off > 0` guard:**

```jsx
// BEFORE
const off = hasDiscount ? Math.round(((product.price - price) / product.price) * 100) : 0;

// AFTER
const off = hasDiscount
  ? Math.round(((product.price - price) / product.price) * 100)
  : 0;

// Then in the JSX, change the badge condition:
// BEFORE
{hasDiscount && (
  <span ...>-{off}%</span>
)}

// AFTER
{hasDiscount && off > 0 && (
  <span ...>-{off}%</span>
)}
```

**Test:** Create a product where `discountPrice === price` → it should show no discount badge. Create one with a real discount → badge should show correctly.

---

### Task 10 — Add a shared price formatter utility
**Priority:** 🟢 Low  
**File:** Create `client/src/lib/format.js`

**Problem:** Prices are formatted as `` ₹${price.toLocaleString()} `` in 15+ places across the codebase. The output varies by browser locale. In India, `toLocaleString()` can produce `₹1,00,000` (lakh format) which looks wrong to international users.

**Fix — create the utility:**

```js
// client/src/lib/format.js
const priceFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(amount) {
  return priceFormatter.format(amount ?? 0);
}
```

**Then do a find-and-replace across the codebase:**

```
Search:  ₹{(                        → replace usage by usage
Search:  ₹${                        → replace usage by usage
```

Replace all occurrences with `{formatPrice(someValue)}`. Key files to update: `ProductCard.jsx`, `ProductDetail.jsx`, `Cart.jsx`, `CartSidebar.jsx`, `Checkout.jsx`, `Orders.jsx`, `OrderDetail.jsx`, `SellerProducts.jsx`, `AdminOrders.jsx`, `AdminProducts.jsx`.

**Test:** Open the product listing → prices should show as `₹1,999` consistently across all browsers and locales.

---

## ✅ Sprint 2 Test Checklist

- [ ] All admin/seller data tables load without console errors
- [ ] Going to `/orders` logged out → logging in → lands on `/orders`
- [ ] Checkout address form pre-fills if profile address is saved
- [ ] No "-0%" badge on products with no actual discount
- [ ] Prices format consistently as `₹X,XXX` everywhere

---

## 🏁 Sprint 3 — Do these 5, then stop and test

---

### Task 11 — Fix review submission not refreshing product rating
**Priority:** 🟡 Medium  
**File:** `client/src/pages/ProductDetail.jsx`

**Problem:** After submitting a review, the reviews list refreshes but the product's star rating and `numReviews` count remain stale until the page is hard-reloaded.

**Fix — re-fetch the product after a successful review submission:**

```jsx
// Inside submitReview, after the reviews list is re-fetched:
const submitReview = async (e) => {
  e.preventDefault();
  if (!isAuthenticated) return toast.error("Please sign in to leave a review");
  try {
    await api.post(`/reviews/${id}`, newReview);
    toast.success("Review submitted");
    setNewReview({ rating: 5, comment: "" });
    setHoverRating(0);

    // Re-fetch both reviews AND product in parallel
    const [updatedProduct, updatedReviews] = await Promise.all([
      api.get(`/products/${id}`).then((r) => r.data?.data || r.data?.product || r.data),
      api.get(`/reviews/${id}`).then((r) => r.data?.data || r.data?.reviews || r.data),
    ]);
    if (updatedProduct) setProduct(updatedProduct);
    setReviews(Array.isArray(updatedReviews) ? updatedReviews : []);
  } catch (err) {
    toast.error(err?.response?.data?.message || "Could not submit review");
  }
};
```

**Test:** Go to a product → submit a review → the star rating and `(N reviews)` count should update immediately without a page reload.

---

### Task 12 — Hide review form from unauthenticated users
**Priority:** 🟠 High  
**File:** `client/src/pages/ProductDetail.jsx`

**Problem:** The review form renders for everyone. A guest fills it out, clicks Submit, and gets a toast error. This is a confusing dead end.

**Fix — replace the form with a sign-in prompt for guests:**

```jsx
// Replace the entire review form section:
{isAuthenticated ? (
  <form onSubmit={submitReview} style={{ /* existing styles */ }}>
    {/* existing form content unchanged */}
  </form>
) : (
  <div style={{
    borderRadius: '12px', border: '1px solid var(--border)',
    backgroundColor: 'var(--card)', padding: '1.5rem', textAlign: 'center',
  }}>
    <p style={{ fontWeight: 600 }}>Have something to say?</p>
    <p style={{ marginTop: '0.375rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
      Sign in to write a review for this product.
    </p>
    <Link
      to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
      className="btn-orange"
      style={{ display: 'inline-flex', marginTop: '1rem', borderRadius: '9999px', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}
    >
      Sign in to review
    </Link>
  </div>
)}
```

**Test:** Open a product page while logged out → you should see a "Sign in to review" card, not a form. Log in → the form should appear.

---

### Task 13 — Add product image file upload to the product form
**Priority:** 🟠 High  
**File:** `client/src/components/ProductForm.jsx`

**Problem:** Sellers must paste image URLs manually. The upload endpoint already exists (`POST /api/upload`) but is not connected to the form.

**Fix — add a file input button next to the URL input:**

```jsx
// In ProductForm.jsx, inside the Images section, add below the URL input div:
const [uploading, setUploading] = useState(false);

const handleFileUpload = async (e) => {
  const files = e.target.files;
  if (!files?.length) return;
  setUploading(true);
  try {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append("images", f));
    const res = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const urls = res.data?.data?.urls || [];
    setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
  } catch {
    toast.error("Upload failed");
  } finally {
    setUploading(false);
    e.target.value = "";
  }
};

// Add this button next to the existing URL input:
<label style={{ borderRadius: '6px', border: '1px solid var(--border)', padding: '0.5rem 0.75rem', fontSize: '0.875rem', cursor: 'pointer', background: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
  <Upload style={{ width: 16, height: 16 }} />
  {uploading ? "Uploading…" : "Upload"}
  <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
</label>
```

Add `Upload` to your lucide-react imports at the top of the file.

**Test:** Go to Add Product → click Upload → select 1–2 images → they should appear in the image preview grid with an × to remove them.

---

### Task 14 — Fix order tracker dates showing all the same
**Priority:** 🟢 Low  
**File:** `client/src/pages/OrderDetail.jsx`

**Problem:** Every completed step in the order tracker renders `new Date(order.updatedAt).toLocaleDateString()`, which is just the last status-change time. All steps show the same date.

**Fix — only show the date label on the current active step:**

```jsx
// In the tracker step map, change the date rendering:
{isPastOrCurrent && idx === currentIndex && (
  <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '2px', fontWeight: 600 }}>
    {idx === 0
      ? new Date(order.createdAt).toLocaleDateString()
      : new Date(order.updatedAt).toLocaleDateString()}
  </span>
)}
```

This shows a date only on the step the order is currently at — the "Ordered" step always shows `createdAt`, the active step shows `updatedAt`.

**Test:** Open an order in "shipped" status → only the "Shipped" step should show a date, not Confirmed and Ordered too.

---

### Task 15 — Add "Customers also bought" section to product detail
**Priority:** 🟢 Low  
**File:** `client/src/pages/ProductDetail.jsx`

**Problem:** There's no cross-sell section. This is one of Amazon's highest-converting layout features and requires no backend changes — just another API call.

**Fix — add a related products section after the specs table:**

```jsx
// Add state
const [related, setRelated] = useState([]);

// Add to the existing useEffect, after the product loads:
if (p?.category) {
  const catId = typeof p.category === "object" ? p.category._id : p.category;
  api.get("/products", { params: { category: catId, limit: 5 } })
    .then((r) => {
      const body = r.data?.data || r.data;
      const products = body?.products || (Array.isArray(body) ? body : []);
      setRelated(products.filter(item => item._id !== id).slice(0, 4));
    })
    .catch(() => {});
}

// Add section after the main grid, before the reviews section:
{related.length > 0 && (
  <section style={{ marginTop: '2.5rem' }}>
    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
      Customers also bought
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
      {related.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  </section>
)}
```

**Test:** Open any product page → a "Customers also bought" grid should appear below the specs and above the reviews, showing 2–4 products from the same category.

---

## ✅ Sprint 3 Test Checklist

- [ ] Submitting a review updates the star rating immediately
- [ ] Logged-out users see a "Sign in to review" card, not a broken form
- [ ] Sellers can upload images by clicking a button in the product form
- [ ] Order tracker only shows a date on the current active step
- [ ] Product pages show a "Customers also bought" section

---

## 🏁 Sprint 4 — Do these 5, then stop and test

---

### Task 16 — Add skeleton loaders to the home and product pages
**Priority:** 🟡 Medium  
**Files:** `client/src/pages/Home.jsx`, `client/src/pages/Products.jsx`

**Problem:** Every page shows a centered spinner that replaces all content, causing a jarring layout jump. Skeleton screens feel instant because the layout doesn't shift.

**Fix — create a reusable skeleton component:**

```jsx
// client/src/components/ProductCardSkeleton.jsx
export default function ProductCardSkeleton() {
  return (
    <div style={{
      borderRadius: '12px', border: '1px solid var(--border)',
      backgroundColor: 'var(--card)', overflow: 'hidden',
    }}>
      <div style={{
        aspectRatio: '1/1', backgroundColor: 'var(--muted)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
      <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ height: '0.75rem', width: '40%', borderRadius: '4px', backgroundColor: 'var(--muted)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '0.875rem', width: '90%', borderRadius: '4px', backgroundColor: 'var(--muted)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '0.875rem', width: '70%', borderRadius: '4px', backgroundColor: 'var(--muted)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '1.125rem', width: '50%', borderRadius: '4px', backgroundColor: 'var(--muted)', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: '2rem', borderRadius: '9999px', backgroundColor: 'var(--muted)', animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    </div>
  );
}
```

Add `@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.5 } }` to `index.css`.

**Then in `Home.jsx` replace the `<LoadingSpinner>` in the featured products section:**

```jsx
{loading ? (
  <div className="product-grid">
    {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
  </div>
) : (
  // existing products render
)}
```

Apply the same pattern in `Products.jsx`.

**Test:** Throttle your network in DevTools to "Slow 3G" → reload the products page → you should see a grid of gray skeleton cards, not a blank page with a spinner.

---

### Task 17 — Add a wishlist feature
**Priority:** 🟠 High  
**Files:** `server/models/User.js`, new route + controller, `client/src/context/WishlistContext.jsx`, `ProductCard.jsx`, `ProductDetail.jsx`

**Problem:** There's no way to save products for later. This is the most-used secondary action on Amazon after "Add to cart".

**Fix — Step 1: add `wishlist` field to User model:**

```js
// server/models/User.js — add to userSchema
wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
```

**Step 2: add wishlist routes to `server/routes/authRoutes.js`:**

```js
// Add these two routes
router.post('/wishlist/:productId', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  const id = req.params.productId;
  const exists = user.wishlist.includes(id);
  if (exists) {
    user.wishlist = user.wishlist.filter(p => p.toString() !== id);
  } else {
    user.wishlist.push(id);
  }
  await user.save();
  res.json({ success: true, data: { wishlist: user.wishlist, added: !exists } });
});

router.get('/wishlist', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).populate('wishlist');
  res.json({ success: true, data: user.wishlist });
});
```

**Step 3: create `client/src/context/WishlistContext.jsx`:**

```jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(undefined);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [ids, setIds] = useState(new Set());

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get("/auth/wishlist").then((r) => {
      const items = r.data?.data || [];
      setIds(new Set(items.map(p => p._id || p)));
    }).catch(() => {});
  }, [isAuthenticated]);

  const toggle = async (productId) => {
    setIds(prev => {
      const next = new Set(prev);
      next.has(productId) ? next.delete(productId) : next.add(productId);
      return next;
    });
    await api.post(`/auth/wishlist/${productId}`).catch(() => {});
  };

  return (
    <WishlistContext.Provider value={{ ids, toggle, has: (id) => ids.has(id) }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be inside WishlistProvider");
  return ctx;
}
```

**Step 4: wrap it in `main.jsx`** alongside `CartProvider`.

**Step 5: add the heart button to `ProductCard.jsx`:**

```jsx
import { useWishlist } from "@/context/WishlistContext";
import { Heart } from "lucide-react";

// Inside the component:
const { has, toggle } = useWishlist();
const wished = has(product._id);

// Add to the image wrapper (top-right corner):
<button
  onClick={(e) => { e.preventDefault(); toggle(product._id); }}
  style={{
    position: 'absolute', right: '0.5rem', top: '0.5rem',
    background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
    width: '2rem', height: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  }}
>
  <Heart style={{ width: 16, height: 16, fill: wished ? 'var(--destructive)' : 'none', color: wished ? 'var(--destructive)' : 'var(--muted-foreground)' }} />
</button>
```

**Test:** Click the heart on any product card → heart should fill red instantly (optimistic) → navigate away and come back → heart should still be filled.

---

### Task 18 — Add search autocomplete to the navbar
**Priority:** 🟠 High  
**File:** `client/src/components/Navbar.jsx`

**Problem:** The search only works on full form submit. Amazon shows live suggestions as you type.

**Fix — add a debounced suggestion dropdown:**

```jsx
// Add state at the top of Navbar
const [suggestions, setSuggestions] = useState([]);
const [showSugg, setShowSugg] = useState(false);
const debounceRef = useRef(null);

// Replace the existing input onChange:
onChange={(e) => {
  const val = e.target.value;
  setQ(val);
  clearTimeout(debounceRef.current);
  if (val.length < 2) { setSuggestions([]); setShowSugg(false); return; }
  debounceRef.current = setTimeout(async () => {
    try {
      const res = await api.get("/products", { params: { keyword: val, limit: 5 } });
      const body = res.data?.data || res.data;
      const products = body?.products || (Array.isArray(body) ? body : []);
      setSuggestions(products);
      setShowSugg(products.length > 0);
    } catch {}
  }, 300);
}}
onBlur={() => setTimeout(() => setShowSugg(false), 200)}
onFocus={() => suggestions.length > 0 && setShowSugg(true)}

// Add the dropdown after the search form's closing tag:
{showSugg && (
  <div style={{
    position: 'absolute', top: '100%', left: 0, right: 0,
    backgroundColor: 'var(--card)', border: '1px solid var(--border)',
    borderRadius: '6px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    zIndex: 60, marginTop: '0.25rem', overflow: 'hidden',
  }}>
    {suggestions.map((p) => (
      <div
        key={p._id}
        onMouseDown={() => { navigate(`/products/${p._id}`); setShowSugg(false); setQ(""); }}
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.75rem', cursor: 'pointer', borderBottom: '1px solid var(--border)' }}
      >
        <div style={{ width: '2.5rem', height: '2.5rem', overflow: 'hidden', borderRadius: '4px', backgroundColor: 'var(--muted)', flexShrink: 0 }}>
          {p.images?.[0] && <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
        </div>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{p.title}</div>
          {p.brand && <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{p.brand}</div>}
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '0.875rem', fontWeight: 600 }}>₹{p.discountPrice || p.price}</div>
      </div>
    ))}
  </div>
)}
```

Wrap the search form in `<div style={{ position: 'relative', flex: 1 }}>` so the dropdown positions correctly.

**Test:** Type "phone" in the search box → a dropdown should appear with matching products after ~300ms → clicking a suggestion navigates to that product.

---

### Task 19 — Add "verified purchase" badge on reviews
**Priority:** 🟡 Medium  
**Files:** `server/models/Review.js`, `server/controllers/reviewController.js`, `client/src/pages/ProductDetail.jsx`

**Problem:** Any customer can review any product even if they never bought it. The "Verified Purchase" badge is Amazon's primary trust signal for reviews.

**Fix — Step 1: add `verified` field to Review model:**

```js
// server/models/Review.js
verified: { type: Boolean, default: false },
```

**Step 2: check for a delivered order in `addReview`:**

```js
// server/controllers/reviewController.js
const Order = require('../models/Order');

// Add this check before creating the review:
const deliveredOrder = await Order.findOne({
  buyer: req.user.id,
  status: 'delivered',
  'items.product': productId,
});

const review = await Review.create({
  product: productId,
  user: req.user.id,
  rating: Number(rating),
  comment,
  verified: !!deliveredOrder,
});
```

**Step 3: display the badge in `ProductDetail.jsx`:**

```jsx
// Inside the reviews map, after the reviewer name:
{r.verified && (
  <span style={{
    fontSize: '0.7rem', fontWeight: 600, color: '#15803d',
    backgroundColor: 'rgba(40,167,69,0.1)', padding: '1px 6px',
    borderRadius: '4px', marginLeft: '0.5rem',
  }}>
    ✓ Verified Purchase
  </span>
)}
```

**Test:** Leave a review as a customer who has a delivered order for that product → the badge should appear. Leave one as a customer who hasn't bought it → no badge.

---

### Task 20 — Add mobile filter collapse to the Products page
**Priority:** 🟡 Medium  
**File:** `client/src/pages/Products.jsx`

**Problem:** On small screens the filter sidebar renders full-width above the product grid with no way to hide it, consuming most of the visible viewport.

**Fix — add a toggle button and conditional render:**

```jsx
// Add state
const [filtersOpen, setFiltersOpen] = useState(false);

// Add a mobile filter toggle button above the results section
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
  <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
    {keyword ? `Results for "${keyword}"` : "All Products"}
  </h1>
  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
    {/* Mobile filter toggle */}
    <button
      onClick={() => setFiltersOpen(v => !v)}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.75rem',
        borderRadius: '6px', border: '1px solid var(--border)', background: filtersOpen ? 'var(--muted)' : 'transparent',
        fontSize: '0.875rem', cursor: 'pointer',
      }}
      className="mobile-filter-toggle"
    >
      Filters {/* show active filter count */}
      {(category || minPrice || maxPrice || rating) && (
        <span style={{ backgroundColor: 'var(--nest-orange)', color: 'var(--nest-navy)', borderRadius: '99px', padding: '0 5px', fontSize: '0.7rem', fontWeight: 700 }}>
          {[category, minPrice, maxPrice, rating].filter(Boolean).length}
        </span>
      )}
    </button>
    {/* existing sort select */}
  </div>
</div>

// Wrap the aside in a conditional:
<aside style={{
  /* existing styles */
  display: filtersOpen ? 'flex' : 'none', // on mobile: toggle
}}>
```

Add to `index.css`:
```css
@media (min-width: 1024px) {
  .mobile-filter-toggle { display: none !important; }
  .grid-filters-content aside { display: flex !important; flex-direction: column; }
}
```

**Test:** On mobile viewport (or DevTools narrow), the filter sidebar should be hidden by default. Click "Filters" → sidebar appears. Active filters should show a count badge on the button.

---

## ✅ Sprint 4 Test Checklist

- [ ] Product grids show skeleton cards on slow connections
- [ ] Heart icon on product cards toggles wishlist, persists on refresh
- [ ] Typing in the search bar shows a live suggestion dropdown
- [ ] Reviews from verified buyers show a green "Verified Purchase" badge
- [ ] On mobile, filters are hidden behind a toggle button

---

## 🏁 Sprint 5 — Do these 5, then stop and test

---

### Task 21 — Add revenue chart to admin dashboard
**Priority:** 🟡 Medium  
**Files:** `server/controllers/adminController.js`, `client/src/pages/AdminDashboard.jsx`

**Problem:** The admin dashboard shows total revenue as a single number with no trend data. There's no way to see if the platform is growing.

**Fix — Step 1: add `dailyRevenue` to the stats endpoint:**

```js
// server/controllers/adminController.js — inside getStats
const last30 = new Date();
last30.setDate(last30.getDate() - 30);

const dailyRevenue = await Order.aggregate([
  { $match: { createdAt: { $gte: last30 }, status: { $ne: 'cancelled' } } },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      amount: { $sum: "$totalPrice" },
    },
  },
  { $sort: { _id: 1 } },
  { $project: { date: "$_id", amount: 1, _id: 0 } },
]);

res.json({
  success: true,
  data: {
    totalUsers, totalSellers, totalProducts, totalOrders,
    totalRevenue, pendingOrders, newUsersToday,
    dailyRevenue, // ← add this
  },
});
```

**Fix — Step 2: render the chart in `AdminDashboard.jsx`:**

```jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Inside AdminDashboardContent, after the stat cards:
{s.dailyRevenue?.length > 0 && (
  <div style={{ marginTop: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', backgroundColor: 'var(--card)', padding: '1.25rem' }}>
    <h3 style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>Revenue — last 30 days</h3>
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={s.dailyRevenue}>
        <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(d) => d.slice(5)} />
        <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`, "Revenue"]} />
        <Bar dataKey="amount" fill="var(--nest-orange)" radius={[3,3,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}
```

**Test:** Admin dashboard → a bar chart should appear below the stat cards showing daily revenue for the last 30 days.

---

### Task 22 — Add low-stock alerts to the seller dashboard
**Priority:** 🟢 Low  
**Files:** `client/src/pages/SellerDashboard.jsx`, `client/src/pages/SellerProducts.jsx`

**Problem:** Sellers have no visual indication when stock is running low.

**Fix — `SellerProducts.jsx`: highlight low-stock rows in the table:**

```jsx
// In the table row, add a conditional background:
<tr key={p._id} style={{ backgroundColor: p.stock === 0 ? 'rgba(220,53,69,0.07)' : p.stock < 5 ? 'rgba(255,153,0,0.07)' : 'transparent' }}>

// And add a badge to the stock cell:
<td>
  {p.stock}
  {p.stock === 0 && (
    <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', backgroundColor: 'rgba(220,53,69,0.15)', color: 'var(--destructive)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
      Out of stock
    </span>
  )}
  {p.stock > 0 && p.stock < 5 && (
    <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', backgroundColor: 'rgba(255,153,0,0.15)', color: 'var(--nest-orange-hover)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
      Low stock
    </span>
  )}
</td>
```

**Fix — `SellerDashboard.jsx`: add a restocking alert card:**

```jsx
// Add to the dashboard content, below the stat cards:
{lowStockCount > 0 && (
  <div style={{ marginTop: '1rem', borderRadius: '8px', border: '1px solid rgba(255,153,0,0.4)', backgroundColor: 'rgba(255,153,0,0.08)', padding: '0.875rem 1rem', fontSize: '0.875rem' }}>
    ⚠️ <strong>{lowStockCount} product{lowStockCount > 1 ? 's' : ''}</strong> need restocking.
    <Link to="/seller/products" style={{ marginLeft: '0.5rem', color: 'var(--nest-link)', fontWeight: 500 }}>View →</Link>
  </div>
)}
```

Compute `lowStockCount` in the `useEffect` that fetches products:
```jsx
const low = productsArr.filter(p => p.stock < 5).length;
setStats({ ..., lowStockCount: low });
```

**Test:** Set a product's stock to 2 → go to seller dashboard → an amber alert appears. Set to 0 → the table row is red and shows "Out of stock" badge.

---

### Task 23 — Add a "Verified purchase" review gate on the backend
*(This complements Task 19 — only needed if you want to restrict unverified reviews entirely)*  
**Priority:** 🟢 Low  
**File:** `server/controllers/reviewController.js`

**Problem:** Currently anyone can review any product. For stricter Amazon-like behaviour, you may want to require a purchase before leaving a review.

**Fix — add an optional gate (controlled by an env variable so you can toggle it):**

```js
// In addReview, after the duplicate check:
if (process.env.REQUIRE_PURCHASE_TO_REVIEW === 'true') {
  const Order = require('../models/Order');
  const hasPurchased = await Order.exists({
    buyer: req.user.id,
    status: 'delivered',
    'items.product': productId,
  });
  if (!hasPurchased) {
    return res.status(403).json({
      success: false,
      message: 'You can only review products you have purchased and received.'
    });
  }
}
```

Add `REQUIRE_PURCHASE_TO_REVIEW=false` to your `.env` (set `true` to enforce it).

**Test:** Set `REQUIRE_PURCHASE_TO_REVIEW=true` → try to review a product you haven't bought → should get a 403 error toast. Set it `false` → review works without a purchase.

---

### Task 24 — Add empty-state CTA for fresh installs
**Priority:** 🟢 Low  
**File:** `client/src/pages/Home.jsx`

**Problem:** New installations show "No products available yet" in tiny muted text. New users and sellers have no clear action to take.

**Fix — replace the generic empty state with a role-aware CTA:**

```jsx
// In the Featured Products section, replace the empty-state div:
{loading ? (
  <div className="product-grid">{Array.from({length:8}).map((_,i)=><ProductCardSkeleton key={i}/>)}</div>
) : products.length === 0 ? (
  <div style={{ borderRadius: '12px', border: '1px dashed var(--border)', padding: '3rem 1.5rem', textAlign: 'center' }}>
    <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🛍️</div>
    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>No products yet</h3>
    <p style={{ marginTop: '0.375rem', fontSize: '0.875rem', color: 'var(--muted-foreground)', maxWidth: '24rem', margin: '0.375rem auto 0' }}>
      {user?.role === 'seller'
        ? "You're the first seller here. Add your first product to get started."
        : "Products are on their way. Check back soon or become a seller."}
    </p>
    {user?.role === 'seller' ? (
      <Link to="/seller/products/add" className="btn-orange" style={{ display: 'inline-flex', marginTop: '1rem', borderRadius: '9999px', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
        Add your first product
      </Link>
    ) : (
      <Link to="/register" className="btn-orange" style={{ display: 'inline-flex', marginTop: '1rem', borderRadius: '9999px', padding: '0.5rem 1.5rem', fontSize: '0.875rem' }}>
        Become a seller
      </Link>
    )}
  </div>
) : (
  <div className="product-grid">{products.map(p => <ProductCard key={p._id} product={p}/>)}</div>
)}
```

**Test:** Clear your products collection → visit the home page as a guest → CTA should say "Become a seller". Log in as a seller → CTA should say "Add your first product".

---

### Task 25 — Add GST estimate to cart and checkout
**Priority:** 🟢 Low  
**Files:** `client/src/pages/Cart.jsx`, `client/src/pages/Checkout.jsx`

**Problem:** Both pages show "Tax: Calculated at checkout" even on the checkout page itself, making the order summary feel incomplete. Amazon always shows an estimated total.

**Fix — add an 18% GST estimate to the order summary:**

```jsx
// In both Cart.jsx and Checkout.jsx, add a tax calculation:
const tax = Math.round(subtotal * 0.18);
const total = subtotal + tax;

// Replace the tax line:
<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
  <span style={{ color: 'var(--muted-foreground)' }}>GST (18% est.)</span>
  <span>₹{tax.toLocaleString()}</span>
</div>

// Update the total:
<span style={{ fontSize: '1.25rem', fontWeight: 700 }}>₹{total.toLocaleString()}</span>
```

**Note:** The actual order `totalPrice` stored in the DB currently doesn't include tax. You have two options: (a) keep this as a display-only estimate and note "GST included" at checkout, or (b) update `orderController.placeOrder` to also calculate tax and add it to `totalPrice`. Option (a) is simpler and fine for an internship project.

**Test:** Add items to cart → go to Cart page → a "GST (18% est.)" line should appear. The total should be subtotal + 18%.

---

## ✅ Sprint 5 Test Checklist

- [ ] Admin dashboard shows a 30-day revenue bar chart
- [ ] Products with stock < 5 show amber "Low stock" badge in seller table
- [ ] Seller dashboard shows an alert when products need restocking
- [ ] Empty home page shows a role-aware CTA, not blank grey text
- [ ] Cart and checkout show an estimated GST line and updated total

---

## 📋 Backlog (Nice to have — do after all 5 sprints)

These are real features but take longer — good for a second pass or v2.

| # | Feature | Effort |
|---|---|---|
| 26 | Coupon / promo code system | Medium |
| 27 | Order status email notifications (Nodemailer) | Medium |
| 28 | Product Q&A section | Medium |
| 29 | Razorpay payment integration | Large |
| 30 | Admin category management UI (currently API-only) | Small |
| 31 | User profile edit page | Small |
| 32 | Seller payout/earnings breakdown | Medium |
| 33 | Replace Navbar mobile menu with slide-over drawer | Small |

---

## 🔑 Quick reference — key files

| What broke | File to open |
|---|---|
| API routes | `server/routes/*.js` |
| API logic | `server/controllers/*.js` |
| Data models | `server/models/*.js` |
| Auth state | `client/src/context/AuthContext.jsx` |
| Cart state | `client/src/context/CartContext.jsx` |
| Global styles | `client/src/index.css` |
| Shared layout | `client/src/components/Navbar.jsx`, `Footer.jsx` |
| Reusable components | `client/src/components/` |
| Page components | `client/src/pages/` |
| Axios instance | `client/src/lib/api.js` |
| Server entry | `server/index.js` |
| DB seed | `server/seed/seed.js` |

---

*Total tasks: 25 across 5 sprints + 8 backlog items.*  
*Each sprint is roughly 2–3 hours of focused work.*