const express = require('express');
const router = express.Router();
const {
    checkAvailability, createBooking, getMyBookings,
    getVendorBookings, getBooking, updateBookingStatus,
    cancelBooking, getAllBookings,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/availability/:mandapId', checkAvailability);
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/vendor', protect, authorize('vendor'), getVendorBookings);
router.get('/admin', protect, authorize('admin'), getAllBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, authorize('vendor', 'admin'), updateBookingStatus);
router.delete('/:id', protect, cancelBooking);

module.exports = router;
