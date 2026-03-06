const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// Get all notifications for user
router.get('/', protect, async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
        .sort('-createdAt')
        .limit(50);
    const unread = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    res.json({ success: true, data: notifications, unreadCount: unread });
});

// Mark as read
router.put('/:id/read', protect, async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true, readAt: new Date() });
    res.json({ success: true });
});

// Mark all as read
router.put('/mark-all-read', protect, async (req, res) => {
    await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { isRead: true, readAt: new Date() }
    );
    res.json({ success: true });
});

// Delete notification
router.delete('/:id', protect, async (req, res) => {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

module.exports = router;
