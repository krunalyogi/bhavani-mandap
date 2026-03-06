const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// Admin: get all users
router.get('/', protect, authorize('admin'), async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const [users, total] = await Promise.all([
        User.find({ role: 'user' }).sort('-createdAt').skip((page - 1) * limit).limit(limit),
        User.countDocuments({ role: 'user' }),
    ]);
    res.json({ success: true, data: users, pagination: { total, page, limit } });
});

// Admin: toggle user active/inactive
router.put('/:id/toggle', protect, authorize('admin'), async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.json({ success: true, isActive: user.isActive });
});

// Get user wishlist
router.get('/wishlist', protect, async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: 'wishlist',
        select: 'title images basePrice discountedPrice location ratings',
        populate: { path: 'vendor', select: 'businessName logo' },
    });
    res.json({ success: true, data: user.wishlist });
});

module.exports = router;
