const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getSellerOrders,
} = require('../controllers/orderController');
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');

// Customer routes
router.post('/', verifyToken, roleGuard('customer'), placeOrder);
router.get('/mine', verifyToken, roleGuard('customer'), getMyOrders);

// Seller routes
router.get('/seller/mine', verifyToken, roleGuard('seller'), getSellerOrders);

// Admin routes
router.get('/', verifyToken, roleGuard('admin'), getAllOrders);

// Shared routes
router.get('/:id', verifyToken, getOrderById);
router.put('/:id/status', verifyToken, roleGuard('admin', 'seller'), updateOrderStatus);

module.exports = router;
