const MandapDesign = require('../models/MandapDesign');
const cloudinary = require('../config/cloudinary');

// Helper: build filter query
const buildQuery = (queryParams) => {
    const { city, category, minPrice, maxPrice, style, capacity, isFeatured, search } = queryParams;
    const query = { isActive: true };

    if (city) query['location.city'] = new RegExp(city, 'i');
    if (category) query.category = category;
    if (isFeatured === 'true') query.isFeatured = true;
    if (style) query.decorationStyles = style;
    if (capacity) {
        query['capacity.max'] = { $gte: Number(capacity) };
    }
    if (minPrice || maxPrice) {
        query.basePrice = {};
        if (minPrice) query.basePrice.$gte = Number(minPrice);
        if (maxPrice) query.basePrice.$lte = Number(maxPrice);
    }
    if (search) {
        query.$text = { $search: search };
    }
    return query;
};

// @desc    Get all mandaps (with filters + pagination)
// @route   GET /api/mandaps
// @access  Public
exports.getMandaps = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    const query = buildQuery(req.query);

    const [mandaps, total] = await Promise.all([
        MandapDesign.find(query)
            .populate('vendor', 'businessName logo ratings address')
            .populate('category', 'name slug icon')
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .select('-customizationOptions -services -availability'),
        MandapDesign.countDocuments(query),
    ]);

    res.json({
        success: true,
        data: mandaps,
        pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
};

// @desc    Get single mandap by ID or slug
// @route   GET /api/mandaps/:id
// @access  Public
exports.getMandap = async (req, res) => {
    const isObjectId = req.params.id.match(/^[0-9a-fA-F]{24}$/);
    const mandap = await MandapDesign.findOne(
        isObjectId ? { _id: req.params.id } : { slug: req.params.id }
    )
        .populate('vendor', 'businessName logo ratings address phone whatsapp socialLinks')
        .populate('category', 'name slug icon');

    if (!mandap) {
        return res.status(404).json({ success: false, message: 'Mandap not found' });
    }

    // Increment view count
    mandap.viewCount += 1;
    await mandap.save({ validateBeforeSave: false });

    res.json({ success: true, data: mandap });
};

// @desc    Create mandap (vendor)
// @route   POST /api/mandaps
// @access  Vendor
exports.createMandap = async (req, res) => {
    const Vendor = require('../models/Vendor');
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor || vendor.status !== 'approved') {
        return res.status(403).json({ success: false, message: 'Vendor account not approved' });
    }

    const mandap = await MandapDesign.create({ ...req.body, vendor: vendor._id });
    res.status(201).json({ success: true, data: mandap });
};

// @desc    Update mandap
// @route   PUT /api/mandaps/:id
// @access  Vendor / Admin
exports.updateMandap = async (req, res) => {
    const Vendor = require('../models/Vendor');
    let mandap = await MandapDesign.findById(req.params.id);
    if (!mandap) return res.status(404).json({ success: false, message: 'Mandap not found' });

    // Only vendor owner or admin can update
    if (req.user.role !== 'admin') {
        const vendor = await Vendor.findOne({ user: req.user._id });
        if (!vendor || mandap.vendor.toString() !== vendor._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
    }

    mandap = await MandapDesign.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.json({ success: true, data: mandap });
};

// @desc    Delete mandap
// @route   DELETE /api/mandaps/:id
// @access  Vendor / Admin
exports.deleteMandap = async (req, res) => {
    const Vendor = require('../models/Vendor');
    const mandap = await MandapDesign.findById(req.params.id);
    if (!mandap) return res.status(404).json({ success: false, message: 'Mandap not found' });

    if (req.user.role !== 'admin') {
        const vendor = await Vendor.findOne({ user: req.user._id });
        if (!vendor || mandap.vendor.toString() !== vendor._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
    }

    // Delete images from cloudinary
    for (const img of mandap.images) {
        if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
    }

    await mandap.deleteOne();
    res.json({ success: true, message: 'Mandap deleted successfully' });
};

// @desc    Upload mandap images
// @route   POST /api/mandaps/:id/images
// @access  Vendor
exports.uploadImages = async (req, res) => {
    const mandap = await MandapDesign.findById(req.params.id);
    if (!mandap) return res.status(404).json({ success: false, message: 'Mandap not found' });

    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const newImages = req.files.map((file, idx) => ({
        url: file.path,
        publicId: file.filename,
        alt: `${mandap.title} image ${idx + 1}`,
        isPrimary: mandap.images.length === 0 && idx === 0,
    }));

    mandap.images.push(...newImages);
    await mandap.save();

    res.json({ success: true, data: mandap.images });
};

// @desc    Block/unblock dates for mandap
// @route   POST /api/mandaps/:id/block-dates
// @access  Vendor
exports.blockDates = async (req, res) => {
    const { dates } = req.body; // array of date strings
    const mandap = await MandapDesign.findById(req.params.id);
    if (!mandap) return res.status(404).json({ success: false, message: 'Mandap not found' });

    mandap.availability.blockedDates = [...new Set([...mandap.availability.blockedDates, ...dates.map((d) => new Date(d))])];
    await mandap.save();

    res.json({ success: true, data: mandap.availability });
};

// @desc    Toggle wishlist
// @route   POST /api/mandaps/:id/wishlist
// @access  Private (user)
exports.toggleWishlist = async (req, res) => {
    const user = await require('../models/User').findById(req.user._id);
    const mandap = await MandapDesign.findById(req.params.id);
    if (!mandap) return res.status(404).json({ success: false, message: 'Mandap not found' });

    const idx = user.wishlist.indexOf(req.params.id);
    if (idx > -1) {
        user.wishlist.splice(idx, 1);
        mandap.wishlistCount = Math.max(0, mandap.wishlistCount - 1);
    } else {
        user.wishlist.push(req.params.id);
        mandap.wishlistCount += 1;
    }

    await Promise.all([user.save({ validateBeforeSave: false }), mandap.save({ validateBeforeSave: false })]);

    res.json({ success: true, isWishlisted: idx === -1, wishlistCount: mandap.wishlistCount });
};

// @desc    Get featured mandaps
// @route   GET /api/mandaps/featured
// @access  Public
exports.getFeatured = async (req, res) => {
    const mandaps = await MandapDesign.find({ isFeatured: true, isActive: true })
        .populate('vendor', 'businessName logo')
        .populate('category', 'name slug')
        .limit(8)
        .sort('-ratings.average');
    res.json({ success: true, data: mandaps });
};
