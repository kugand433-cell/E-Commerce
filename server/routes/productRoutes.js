const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Seller routes (must be before /:id to avoid conflict)
router.get('/seller/mine', verifyToken, roleGuard('seller'), getMyProducts);

// Seller / Admin routes
router.post('/', verifyToken, roleGuard('seller', 'admin'), createProduct);
router.put('/:id', verifyToken, roleGuard('seller', 'admin'), updateProduct);
router.delete('/:id', verifyToken, roleGuard('seller', 'admin'), deleteProduct);

module.exports = router;
