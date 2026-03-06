const express = require('express');
const router = express.Router();
const {
    createOrder, verifyPayment, getMyPayments,
    webhook, getAllPayments,
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

// Webhook – NO auth (Razorpay sends it)
router.post('/webhook', express.raw({ type: 'application/json' }), webhook);

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/my', protect, getMyPayments);
router.get('/admin', protect, authorize('admin'), getAllPayments);

module.exports = router;
