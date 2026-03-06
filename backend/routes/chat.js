const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const { protect } = require('../middleware/auth');

// Get chat history for a room
router.get('/history/:roomId', protect, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const messages = await ChatMessage.find({ room: req.params.roomId })
        .populate('sender', 'name avatar role')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit);
    res.json({ success: true, data: messages.reverse() });
});

// Get unread count
router.get('/unread', protect, async (req, res) => {
    const count = await ChatMessage.countDocuments({ receiver: req.user._id, isRead: false });
    res.json({ success: true, unreadCount: count });
});

// Get all chat rooms for a user
router.get('/rooms', protect, async (req, res) => {
    const rooms = await ChatMessage.aggregate([
        { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }] } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: '$room', lastMessage: { $first: '$$ROOT' } } },
        {
            $lookup: {
                from: 'users',
                let: { senderId: '$lastMessage.sender', receiverId: '$lastMessage.receiver' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $ne: ['$_id', req.user._id] },
                                    {
                                        $or: [
                                            { $eq: ['$_id', '$$senderId'] },
                                            { $eq: ['$_id', '$$receiverId'] },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    { $project: { name: 1, avatar: 1, role: 1 } },
                ],
                as: 'otherUser',
            },
        },
    ]);
    res.json({ success: true, data: rooms });
});

module.exports = router;
