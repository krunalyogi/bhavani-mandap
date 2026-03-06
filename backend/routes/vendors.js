const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Get vendor profile (public)
router.get('/:id', async (req, res) => {
    const vendor = await Vendor.findById(req.params.id).populate('user', 'name email avatar');
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    res.json({ success: true, data: vendor });
});

// Get all vendors (admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const query = {};
    if (req.query.status) query.status = req.query.status;

    const [vendors, total] = await Promise.all([
        Vendor.find(query)
            .populate('user', 'name email phone createdAt')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(limit),
        Vendor.countDocuments(query),
    ]);

    res.json({ success: true, data: vendors, pagination: { total, page, limit } });
});

// Get my vendor profile
router.get('/me/profile', protect, authorize('vendor'), async (req, res) => {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor profile not found' });
    res.json({ success: true, data: vendor });
});

// Update vendor profile
router.put('/me/profile', protect, authorize('vendor'), async (req, res) => {
    const vendor = await Vendor.findOneAndUpdate(
        { user: req.user._id },
        req.body,
        { new: true, runValidators: true }
    );
    res.json({ success: true, data: vendor });
});

// Upload vendor logo
router.post('/me/logo', protect, authorize('vendor'), (req, res, next) => {
    req.uploadFolder = 'bhavani-mandap/vendors';
    next();
}, upload.single('logo'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const vendor = await Vendor.findOneAndUpdate(
        { user: req.user._id },
        { logo: { url: req.file.path, publicId: req.file.filename } },
        { new: true }
    );
    res.json({ success: true, data: vendor.logo });
});

// Admin: approve / reject vendor
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
    const vendor = await Vendor.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status, isVerified: req.body.status === 'approved' },
        { new: true }
    );

    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const Notification = require('../models/Notification');
    await Notification.create({
        recipient: vendor.user,
        type: req.body.status === 'approved' ? 'vendor_approved' : 'vendor_rejected',
        title: `Vendor Application ${req.body.status}`,
        message: `Your vendor account has been ${req.body.status}. ${req.body.reason || ''}`,
    });

    res.json({ success: true, data: vendor });
});

module.exports = router;
