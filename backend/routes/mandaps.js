const express = require('express');
const router = express.Router();
const {
    getMandaps, getMandap, createMandap, updateMandap,
    deleteMandap, uploadImages, blockDates, toggleWishlist, getFeatured,
} = require('../controllers/mandapController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Set upload folder for mandap images
const setFolder = (req, res, next) => {
    req.uploadFolder = 'bhavani-mandap/mandaps';
    next();
};

router.get('/', getMandaps);
router.get('/featured', getFeatured);
router.get('/:id', getMandap);

router.post('/', protect, authorize('vendor', 'admin'), createMandap);
router.put('/:id', protect, authorize('vendor', 'admin'), updateMandap);
router.delete('/:id', protect, authorize('vendor', 'admin'), deleteMandap);

router.post('/:id/images', protect, authorize('vendor', 'admin'), setFolder, upload.array('images', 10), uploadImages);
router.post('/:id/block-dates', protect, authorize('vendor', 'admin'), blockDates);
router.post('/:id/wishlist', protect, toggleWishlist);

module.exports = router;
