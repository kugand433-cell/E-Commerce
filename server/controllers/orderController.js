const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Customer
exports.placeOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Please provide a complete shipping address' });
    }

    // Fetch product details and validate stock
    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.title}". Available: ${product.stock}`,
        });
      }

      const itemPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

      orderItems.push({
        product: product._id,
        title: product.title,
        image: product.images.length > 0 ? product.images[0] : '',
        price: itemPrice,
        quantity: item.quantity,
      });

      totalPrice += itemPrice * item.quantity;

      // Decrement stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      buyer: req.user.id,
      items: orderItems,
      totalPrice,
      shippingAddress,
      paymentMethod: paymentMethod || 'COD',
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current customer's orders
// @route   GET /api/orders/mine
// @access  Customer
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ buyer: req.user.id })
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Customer (own) / Admin
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email')
      .populate('items.product', 'title images seller');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Customers can only view their own orders
    if (req.user.role === 'customer' && order.buyer._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin / Seller
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id).populate('items.product', 'seller');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Sellers can only update orders containing their products
    if (req.user.role === 'seller') {
      const hasSellerProduct = order.items.some(
        (item) => item.product && item.product.seller && item.product.seller.toString() === req.user.id
      );
      if (!hasSellerProduct) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
      }
    }

    order.status = status;

    // If cancelled, restore stock
    if (status === 'cancelled') {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id || item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    // If delivered, mark as paid (COD)
    if (status === 'delivered' && order.paymentMethod === 'COD') {
      order.isPaid = true;
      order.paidAt = new Date();
    }

    await order.save();

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Admin
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('buyer', 'name email')
      .populate('items.product', 'title images')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

// @desc    Get orders for seller's products
// @route   GET /api/orders/seller/mine
// @access  Seller
exports.getSellerOrders = async (req, res, next) => {
  try {
    // Find all products by this seller
    const sellerProducts = await Product.find({ seller: req.user.id }).select('_id');
    const productIds = sellerProducts.map((p) => p._id);

    // Find orders containing these products
    const orders = await Order.find({
      'items.product': { $in: productIds },
    })
      .populate('buyer', 'name email')
      .populate('items.product', 'title images seller')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};
