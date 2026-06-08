const express = require('express');
const router = express.Router();
const { addReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const verifyToken = require('../middleware/verifyToken');
const roleGuard = require('../middleware/roleGuard');

// Public
router.get('/:productId', getProductReviews);

// Customer only
router.post('/:productId', verifyToken, roleGuard('customer'), addReview);

// Admin only
router.delete('/:reviewId', verifyToken, roleGuard('admin'), deleteReview);

module.exports = router;
