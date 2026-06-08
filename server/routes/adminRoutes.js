const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  changeUserRole,
  deleteUser,
  getStats,
  getAllProducts,
  getAllOrders,
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');

// All admin routes require authentication + admin role
router.use(verifyToken, roleGuard('admin'));

// User management
router.get('/users', getAllUsers);
router.put('/users/:id/role', changeUserRole);
router.delete('/users/:id', deleteUser);

// Dashboard stats
router.get('/stats', getStats);

// Product management
router.get('/products', getAllProducts);

// Order management
router.get('/orders', getAllOrders);

// Category management
router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);

module.exports = router;
