const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get reviews for a mandap
router.get('/mandap/:mandapId', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const [reviews, total] = await Promise.all([
        Review.find({ mandap: req.params.mandapId, isApproved: true, isHidden: false })
            .populate('user', 'name avatar')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(limit),
        Review.countDocuments({ mandap: req.params.mandapId, isApproved: true }),
    ]);
    res.json({ success: true, data: reviews, pagination: { total, page, limit } });
});

// Create review (must have a completed booking)
router.post('/', protect, upload.array('images', 4), async (req, res) => {
    const { mandapId, bookingId, rating, title, comment, subRatings } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.user.toString() !== req.user._id.toString() || booking.status !== 'completed') {
        return res.status(403).json({ success: false, message: 'Can only review completed bookings' });
    }
    if (booking.isReviewed) {
        return res.status(400).json({ success: false, message: 'Already reviewed this booking' });
    }

    const images = (req.files || []).map((f) => ({ url: f.path, publicId: f.filename }));

    const review = await Review.create({
        user: req.user._id,
        mandap: mandapId,
        vendor: booking.vendor,
        booking: bookingId,
        rating,
        title,
        comment,
        subRatings: subRatings ? JSON.parse(subRatings) : {},
        images,
        isVerified: true,
    });

    booking.isReviewed = true;
    await booking.save();

    res.status(201).json({ success: true, data: review });
});

// Vendor reply to review
router.post('/:id/reply', protect, authorize('vendor'), async (req, res) => {
    const review = await Review.findByIdAndUpdate(
        req.params.id,
        { 'vendorReply.comment': req.body.comment, 'vendorReply.repliedAt': new Date() },
        { new: true }
    );
    res.json({ success: true, data: review });
});

// Mark review as helpful
router.post('/:id/helpful', protect, async (req, res) => {
    const review = await Review.findById(req.params.id);
    const idx = review.helpfulVotes.indexOf(req.user._id);
    if (idx > -1) {
        review.helpfulVotes.splice(idx, 1);
        review.helpfulCount -= 1;
    } else {
        review.helpfulVotes.push(req.user._id);
        review.helpfulCount += 1;
    }
    await review.save();
    res.json({ success: true, helpfulCount: review.helpfulCount });
});

// Admin: moderate review
router.put('/:id/moderate', protect, authorize('admin'), async (req, res) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: review });
});

module.exports = router;
