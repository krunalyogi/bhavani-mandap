const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Offer = require('../models/Offer');
const Category = require('../models/Category');

// ── Offers ──────────────────────────────────────────────────────────────────
router.get('/active', async (req, res) => {
    const now = new Date();
    const offers = await Offer.find({
        isActive: true,
        $or: [{ validTill: { $gte: now } }, { validTill: null }],
    }).sort('displayOrder');
    res.json({ success: true, data: offers });
});

router.get('/', protect, authorize('admin'), async (req, res) => {
    const offers = await Offer.find().sort('-createdAt');
    res.json({ success: true, data: offers });
});

router.post('/', protect, authorize('admin'), async (req, res) => {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, data: offer });
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: offer });
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    await Offer.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Offer deleted' });
});

module.exports = router;
