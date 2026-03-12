const express = require('express');
const router = express.Router();
const {
    register, login, refreshToken, getMe,
    updateProfile, changePassword, logout, adminRegister
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/admin-register', adminRegister);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
