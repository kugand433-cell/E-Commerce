const Product = require('../models/Product');

// @desc    Get all products (with filters, search, pagination, sort)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, rating, page = 1, limit = 12, sort } = req.query;

    const filter = { isActive: true };

    // Text search
    if (keyword) {
      filter.$text = { $search: keyword };
    }

    // Category filter
    if (category) {
      // If category is a valid ObjectId, use it directly
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        filter.category = category;
      } else {
        // Otherwise, look up the Category by name or slug
        const Category = require('../models/Category');
        const cat = await Category.findOne({ 
          $or: [
            { slug: category.toLowerCase() },
            { name: new RegExp('^' + category + '$', 'i') }
          ]
        });
        if (cat) {
          filter.category = cat._id;
        } else {
          // Force no match if category name is not found
          filter.category = null;
        }
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Minimum rating filter
    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .populate('seller', 'name')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        products,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        total,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'name email');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Seller / Admin
exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, discountPrice, stock, category, brand, tags, specs, images } = req.body;

    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, price, and category' });
    }

    const product = await Product.create({
      title,
      description,
      price,
      discountPrice: discountPrice || 0,
      stock: stock || 0,
      category,
      seller: req.user.id,
      brand: brand || '',
      tags: tags || [],
      specs: specs || {},
      images: images || [],
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Seller (own) / Admin
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Only the seller who owns the product or an admin can update
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    const allowedFields = ['title', 'description', 'price', 'discountPrice', 'stock', 'category', 'brand', 'tags', 'specs', 'images', 'isActive'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a product (soft delete)
// @route   DELETE /api/products/:id
// @access  Seller (own) / Admin
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Only the seller who owns the product or an admin can delete
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get products listed by current seller
// @route   GET /api/products/seller/mine
// @access  Seller
exports.getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user.id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};
