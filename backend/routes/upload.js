const express = require('express');
const router = express.Router();
const cloudinary = require('../config/cloudinary');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// General image upload (avatar, etc.)
router.post('/image', protect, (req, res, next) => {
    req.uploadFolder = `bhavani-mandap/${req.query.folder || 'general'}`;
    next();
}, upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    res.json({
        success: true,
        url: req.file.path,
        publicId: req.file.filename,
    });
});

// Delete image from Cloudinary
router.delete('/image', protect, async (req, res) => {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ success: false, message: 'publicId required' });
    await cloudinary.uploader.destroy(publicId);
    res.json({ success: true, message: 'Image deleted' });
});

module.exports = router;
