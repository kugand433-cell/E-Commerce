const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// @desc    Change user role
// @route   PUT /api/admin/users/:id/role
// @access  Admin
exports.changeUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['customer', 'seller', 'admin'];

    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete (deactivate) user
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Soft delete — deactivate
    user.isActive = false;
    await user.save();

    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dashboard stats (counts, revenue)
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalSellers, totalProducts, totalOrders, revenueResult] = await Promise.all([
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'seller', isActive: true }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
      ]),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Count pending orders
    const pendingOrders = await Order.countDocuments({ status: 'pending' });

    // Today's new users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: today } });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue,
        pendingOrders,
        newUsersToday,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all products across sellers (Admin)
// @route   GET /api/admin/products
// @access  Admin
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category', 'name slug')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/admin/orders
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

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Admin
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate('parent', 'name').sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Admin
exports.createCategory = async (req, res, next) => {
  try {
    const { name, slug, parent } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Please provide name and slug' });
    }

    const category = await Category.create({ name, slug, parent: parent || null });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Admin
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};
