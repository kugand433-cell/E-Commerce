const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes
router.get('/me', verifyToken, getMe);
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
