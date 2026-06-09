# 🛒 ShopNest — Amazon-Style E-Commerce Platform

> A full-stack MERN e-commerce application with three roles (Admin, Seller, Customer), built as an internship project. Reading this file alone is enough to build the entire system.

---

## 📌 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Environment Variables](#5-environment-variables)
6. [Database Schemas (Mongoose)](#6-database-schemas-mongoose)
7. [API Reference](#7-api-reference)
8. [Role & Permission Matrix](#8-role--permission-matrix)
9. [Frontend Pages & Routes](#9-frontend-pages--routes)
10. [Feature Breakdown by Role](#10-feature-breakdown-by-role)
11. [Product Model — Amazon-Style Fields](#11-product-model--amazon-style-fields)
12. [Authentication Flow](#12-authentication-flow)
13. [Image Upload Flow](#13-image-upload-flow)
14. [Setup & Installation](#14-setup--installation)
15. [Build & Deployment](#15-build--deployment)
16. [Development Roadmap](#16-development-roadmap)

---

## 1. Project Overview

**ShopNest** is an Amazon-inspired multi-vendor e-commerce platform where:

- **Admins** have full control over users, products, orders, and platform data.
- **Sellers** can register, list products with images and details, and track their orders.
- **Customers** can browse, search, filter, add to cart, and purchase products.

The project is built entirely on the **MERN stack** (MongoDB, Express.js, React, Node.js) with JWT-based role authentication.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite), React Router v6, Tailwind CSS, Axios |
| State Management | React Context API (or Redux Toolkit) |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose ODM |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| File Uploads | Multer + Cloudinary (or local `/uploads`) |
| Validation | Joi or Zod (server-side) |
| Dev Tools | ESLint, Prettier, Nodemon, dotenv |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Browsers                        │
│           Admin  |  Seller  |  Customer                  │
└────────────┬────────────────────────────────────────────┘
             │  HTTP (Axios / Fetch)
             ▼
┌─────────────────────────────────────────────────────────┐
│              React Frontend (Vite)                       │
│   /admin/*      /seller/*       /shop/*  (public)        │
└────────────────────┬────────────────────────────────────┘
                     │  REST API calls  (/api/*)
                     ▼
┌─────────────────────────────────────────────────────────┐
│           Express.js + Node.js (REST API)                │
│                                                          │
│  Routes: auth | products | orders | reviews | admin      │
│                                                          │
│  Middleware:                                             │
│    - verifyToken (JWT check)                             │
│    - roleGuard (admin / seller / customer)               │
│    - errorHandler                                        │
│    - CORS, Helmet, express-rate-limit                    │
└────────────────────┬────────────────────────────────────┘
                     │  Mongoose
                     ▼
┌─────────────────────────────────────────────────────────┐
│             MongoDB Atlas (Collections)                  │
│  users | products | orders | reviews | categories        │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         Cloudinary  (product image storage)              │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Folder Structure

```
shopnest/
├── client/                         # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/                    # Axios instance & API calls
│   │   │   └── axiosInstance.js
│   │   ├── assets/                 # Images, icons
│   │   ├── components/             # Shared UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── CartSidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/                # Global state
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── customer/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── ProductDetail.jsx
│   │   │   │   ├── Cart.jsx
│   │   │   │   ├── Checkout.jsx
│   │   │   │   ├── MyOrders.jsx
│   │   │   │   └── CategoryPage.jsx
│   │   │   ├── seller/
│   │   │   │   ├── SellerDashboard.jsx
│   │   │   │   ├── MyProducts.jsx
│   │   │   │   ├── AddProduct.jsx
│   │   │   │   ├── EditProduct.jsx
│   │   │   │   └── SellerOrders.jsx
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AllUsers.jsx
│   │   │       ├── AllProducts.jsx
│   │   │       └── AllOrders.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                         # Express Backend
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   └── cloudinary.js           # Cloudinary config
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   ├── reviewController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── verifyToken.js          # JWT verification
│   │   ├── roleGuard.js            # Role-based access
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── Category.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── uploadRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/                    # Local image storage (dev)
│   ├── .env
│   └── index.js                    # Entry point
│
├── .gitignore
└── README.md
```

---

## 5. Environment Variables

Create a `.env` file inside `/server/`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/shopnest
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Cloudinary (optional — skip for local file storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

Create a `.env` file inside `/client/`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 6. Database Schemas (Mongoose)

### User

```js
// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, minlength: 6 },
  role:      { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  avatar:    { type: String, default: '' },
  address: {
    street:  String,
    city:    String,
    state:   String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  isActive:  { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### Product

```js
// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  price:         { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, default: 0 },
  stock:         { type: Number, required: true, default: 0 },
  images:        [{ type: String }],             // Cloudinary URLs
  category:      { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  seller:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand:         { type: String, default: '' },
  tags:          [{ type: String }],
  specs:         { type: Map, of: String },      // e.g. { "Color": "Red", "Size": "XL" }
  rating:        { type: Number, default: 0 },
  numReviews:    { type: Number, default: 0 },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

// Text index for search
productSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
```

### Order

```js
// server/models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title:    String,
  image:    String,
  price:    Number,
  quantity: { type: Number, default: 1 },
});

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street:  String,
    city:    String,
    state:   String,
    pincode: String,
    country: String
  },
  paymentMethod: { type: String, enum: ['COD', 'online'], default: 'COD' },
  isPaid:        { type: Boolean, default: false },
  paidAt:        Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
```

### Review

```js
// server/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
```

### Category

```js
// server/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name:   { type: String, required: true, unique: true, trim: true },
  slug:   { type: String, required: true, unique: true, lowercase: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
```

---

## 7. API Reference

Base URL: `http://localhost:5000/api`

### Auth Routes `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user (role in body: customer/seller) |
| POST | `/login` | Public | Login, returns JWT token |
| GET | `/me` | Private | Get logged-in user profile |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "role": "customer"
}
```

**Login response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "_id": "...", "name": "John", "role": "customer" }
}
```

---

### Product Routes `/api/products`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/` | Public | Get all products (with filters, search, pagination) |
| GET | `/:id` | Public | Get single product detail |
| POST | `/` | Seller / Admin | Create new product |
| PUT | `/:id` | Seller (own) / Admin | Update product |
| DELETE | `/:id` | Seller (own) / Admin | Delete product |
| GET | `/seller/mine` | Seller | Get products listed by this seller |

**Query params for GET `/`:**
```
?keyword=shirt
&category=<categoryId>
&minPrice=100
&maxPrice=5000
&rating=4
&page=1
&limit=12
&sort=price_asc | price_desc | newest | rating
```

**Create product body:**
```json
{
  "title": "Blue Denim Jacket",
  "description": "Premium quality denim...",
  "price": 1999,
  "discountPrice": 1599,
  "stock": 50,
  "category": "<categoryId>",
  "brand": "Levi's",
  "tags": ["denim", "jacket", "men"],
  "specs": { "Material": "Denim", "Fit": "Regular" },
  "images": ["https://cloudinary.com/..."]
}
```

---

### Order Routes `/api/orders`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Customer | Place an order |
| GET | `/mine` | Customer | Get my orders |
| GET | `/:id` | Customer (own) / Admin | Get single order |
| PUT | `/:id/status` | Admin / Seller | Update order status |
| GET | `/` | Admin | Get all orders |

**Place order body:**
```json
{
  "items": [
    { "product": "<productId>", "quantity": 2 }
  ],
  "shippingAddress": {
    "street": "12 MG Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India"
  },
  "paymentMethod": "COD"
}
```

---

### Review Routes `/api/reviews`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/:productId` | Customer | Add a review |
| GET | `/:productId` | Public | Get all reviews for a product |
| DELETE | `/:reviewId` | Admin | Delete a review |

---

### Upload Route `/api/upload`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/` | Seller / Admin | Upload image(s), returns URL(s) |

Send as `multipart/form-data` with field name `images`.

---

### Admin Routes `/api/admin`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin | Get all users |
| PUT | `/users/:id/role` | Admin | Change user role |
| DELETE | `/users/:id` | Admin | Delete user |
| GET | `/stats` | Admin | Dashboard stats (counts, revenue) |
| GET | `/products` | Admin | Get all products across sellers |
| GET | `/orders` | Admin | Get all orders |

---

## 8. Role & Permission Matrix

| Feature | Customer | Seller | Admin |
|---|---|---|---|
| Register / Login | ✅ | ✅ | ✅ |
| Browse products | ✅ | ✅ | ✅ |
| Add to cart | ✅ | ❌ | ❌ |
| Place order | ✅ | ❌ | ❌ |
| View own orders | ✅ | ✅ (their products) | ✅ (all) |
| Write review | ✅ | ❌ | ❌ |
| Add product | ❌ | ✅ | ✅ |
| Edit own product | ❌ | ✅ | ✅ |
| Delete any product | ❌ | ❌ | ✅ |
| Manage all users | ❌ | ❌ | ✅ |
| Change order status | ❌ | ✅ (own) | ✅ |
| View dashboard stats | ❌ | ✅ (own) | ✅ (all) |

---

## 9. Frontend Pages & Routes

```
/                          → Home (featured products, categories)
/login                     → Login page
/register                  → Register page (choose: customer / seller)
/products                  → Product listing (search + filter)
/products/:id              → Product detail (images, specs, reviews)
/category/:slug            → Products by category
/cart                      → Shopping cart
/checkout                  → Checkout (address + payment)
/orders                    → My orders
/orders/:id                → Single order detail

/seller/dashboard          → Seller dashboard (stats)
/seller/products           → My products list
/seller/products/add       → Add new product
/seller/products/edit/:id  → Edit product
/seller/orders             → Orders for seller's products

/admin/dashboard           → Admin dashboard (platform stats)
/admin/users               → Manage all users
/admin/products            → All products
/admin/orders              → All orders
```

---

## 10. Feature Breakdown by Role

### Customer Features

- **Home page** — Hero banner, category carousel, featured products grid, deals section
- **Product listing** — Keyword search, filter by category / price range / rating / brand, sort by price/rating/newest, pagination (12 per page)
- **Product detail** — Image gallery (multiple images with thumbnails), title, brand, price with discount strike-through, stock badge, rating, specs table, "Add to Cart" button, seller info, reviews section
- **Cart** — Add/remove items, change quantity, subtotal, proceed to checkout
- **Checkout** — Shipping address form, payment method (COD for internship), order summary, place order
- **My Orders** — Order list with status badge (pending / confirmed / shipped / delivered / cancelled), order detail view

### Seller Features

- **Dashboard** — Total products listed, total orders received, total revenue
- **Product management** — Add, edit, delete own products. Upload multiple images via Cloudinary
- **Order tracking** — View orders for their products, update status (confirmed → shipped → delivered)

### Admin Features

- **Dashboard** — Total users, total sellers, total products, total orders, total revenue
- **User management** — View all users, change role, deactivate/delete user
- **Product management** — View/delete any product across all sellers
- **Order management** — View all orders, update any order status

---

## 11. Product Model — Amazon-Style Fields

| Field | Type | Description |
|---|---|---|
| `title` | String | Product name |
| `description` | String | Long description (supports markdown) |
| `price` | Number | MRP / original price |
| `discountPrice` | Number | Selling price (0 if no discount) |
| `stock` | Number | Available quantity |
| `images` | String[] | Array of Cloudinary image URLs |
| `category` | ObjectId | Ref to Category |
| `seller` | ObjectId | Ref to User (seller) |
| `brand` | String | Brand name |
| `tags` | String[] | Searchable tags |
| `specs` | Map | Key-value pairs: `{ "RAM": "8GB", "Color": "Black" }` |
| `rating` | Number | Computed average rating (0–5) |
| `numReviews` | Number | Total review count |
| `isActive` | Boolean | Soft delete / deactivate listing |

---

## 12. Authentication Flow

```
1. User sends POST /api/auth/register or /login
2. Server validates input → checks DB
3. On login success → sign JWT:
      jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
4. Client stores token in localStorage
5. Every protected request sends:
      Authorization: Bearer <token>
6. verifyToken middleware decodes token → sets req.user
7. roleGuard middleware checks req.user.role against allowed roles
```

**verifyToken middleware:**
```js
// server/middleware/verifyToken.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
```

**roleGuard middleware:**
```js
// server/middleware/roleGuard.js
module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Usage in routes:
// router.post('/', verifyToken, roleGuard('seller', 'admin'), createProduct);
```

**Axios instance (client):**
```js
// client/src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

---

## 13. Image Upload Flow

```
Seller fills product form → selects images
→ frontend sends POST /api/upload (multipart/form-data)
→ Multer parses the files on server
→ Files uploaded to Cloudinary
→ Cloudinary returns secure_url[]
→ URLs stored in product.images[]
```

**Upload route:**
```js
// server/routes/uploadRoutes.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

router.post('/', verifyToken, roleGuard('seller', 'admin'), upload.array('images', 5), async (req, res) => {
  try {
    const urls = await Promise.all(
      req.files.map(file => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'shopnest/products' },
            (err, result) => err ? reject(err) : resolve(result.secure_url)
          );
          stream.end(file.buffer);
        });
      })
    );
    res.json({ urls });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;
```

---

## 14. Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (optional for dev — use local storage)
- Git

### Step 1 — Clone the repo

```bash
git clone https://github.com/yourname/shopnest.git
cd shopnest
```

### Step 2 — Setup the server

```bash
cd server
npm install
# Create .env file (see Section 5)
npm run dev        # starts on http://localhost:5000
```

**Server dependencies:**
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5",
    "cloudinary": "^1.41.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.0.0",
    "express-rate-limit": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

**server/index.js:**
```js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/reviews',  require('./routes/reviewRoutes'));
app.use('/api/upload',   require('./routes/uploadRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));

app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Step 3 — Setup the client

```bash
cd ../client
npm install
# Create .env file (see Section 5)
npm run dev        # starts on http://localhost:5173
```

**Client dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## 15. Build & Deployment

### Build for production

```bash
# Build frontend
cd client
npm run build        # outputs to client/dist/

# Serve backend (with frontend static files)
cd ../server
node index.js
```

Serve the `client/dist/` folder as static files from Express:
```js
// Add to server/index.js (after routes)
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
```

### Deploy options

| Service | What to host |
|---|---|
| MongoDB Atlas | Database (free M0 tier) |
| Cloudinary | Image storage (free tier) |
| Render / Railway | Node.js backend |
| Vercel / Netlify | React frontend (or serve from Express above) |

---

## 16. Development Roadmap

### Phase 1 — Core (Week 1–2)
- [x] Project setup (MERN boilerplate)
- [x] MongoDB schemas: User, Product, Order, Review, Category
- [x] Auth API: register, login, JWT middleware
- [x] Product API: CRUD + text search
- [x] Basic React pages: Login, Register, Home, Product listing, Product detail

### Phase 2 — Seller & Cart (Week 3)
- [x] Seller portal: dashboard, add/edit/delete product
- [x] Image upload: Multer + Cloudinary
- [x] Cart (Context API): add, remove, quantity
- [x] Checkout + Order placement API
- [x] Customer: My Orders page

### Phase 3 — Admin & Polish (Week 4)
- [x] Admin dashboard: stats API + UI
- [x] Admin: manage users, all products, all orders
- [x] Reviews: add, list, average rating update
- [x] Filters + sort + pagination on product listing
- [x] Responsive UI (mobile-friendly with Tailwind)

### Optional Enhancements
- [ ] Razorpay / Stripe payment integration
- [ ] Email notifications (Nodemailer)
- [ ] Wishlist feature
- [ ] Product recommendations
- [ ] Advanced search with Elasticsearch

---

## Notes for Developers

- All passwords are hashed with **bcrypt** (cost factor 12). Never store plain passwords.
- JWT tokens expire in **7 days**. Implement refresh token logic for production.
- Product `rating` field is updated automatically via a post-save hook on the Review model (recalculate average and numReviews on the Product document).
- Use `isActive: false` to soft-delete products/users instead of hard deleting from DB.
- For development, you can skip Cloudinary and save images locally in `/server/uploads/` using `multer.diskStorage`. Serve them via `app.use('/uploads', express.static('uploads'))`.
- API responses follow this format:
  ```json
  { "success": true, "data": { ... } }
  { "success": false, "message": "Error message here" }
  ```

---

*Built with ❤️ on the MERN Stack — ShopNest Internship Project*