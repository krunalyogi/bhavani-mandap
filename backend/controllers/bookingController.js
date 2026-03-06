const Booking = require('../models/Booking');
const MandapDesign = require('../models/MandapDesign');
const Vendor = require('../models/Vendor');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

// @desc    Check availability for a date
// @route   GET /api/bookings/availability/:mandapId?date=YYYY-MM-DD
// @access  Public
exports.checkAvailability = async (req, res) => {
    const { mandapId } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ success: false, message: 'Date is required' });

    const mandap = await MandapDesign.findById(mandapId);
    if (!mandap) return res.status(404).json({ success: false, message: 'Mandap not found' });

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Check blocked dates
    const isBlocked = mandap.availability.blockedDates.some((d) => {
        const bd = new Date(d);
        bd.setHours(0, 0, 0, 0);
        return bd.getTime() === targetDate.getTime();
    });

    if (isBlocked) {
        return res.json({ success: true, available: false, reason: 'Date is blocked' });
    }

    // Check existing confirmed bookings
    const existingBooking = await Booking.findOne({
        mandap: mandapId,
        eventDate: {
            $gte: new Date(date),
            $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
        status: { $in: ['pending', 'confirmed', 'in_progress'] },
    });

    if (existingBooking) {
        return res.json({ success: true, available: false, reason: 'Already booked' });
    }

    res.json({ success: true, available: true });
};

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (user)
exports.createBooking = async (req, res) => {
    const {
        mandapId, eventDate, eventTime, eventType, guestCount,
        venueAddress, specialRequests, customDesignId, customizationAmount,
    } = req.body;

    const mandap = await MandapDesign.findById(mandapId).populate('vendor');
    if (!mandap) return res.status(404).json({ success: false, message: 'Mandap not found' });
    if (!mandap.isActive) return res.status(400).json({ success: false, message: 'Mandap is not available' });

    const baseAmount = mandap.effectivePrice || mandap.basePrice;
    const addons = customizationAmount || 0;
    const subtotal = baseAmount + addons;
    const taxAmount = Math.round(subtotal * 0.18); // 18% GST
    const totalAmount = subtotal + taxAmount;
    const advanceAmount = Math.round(totalAmount * 0.3); // 30% advance

    const booking = await Booking.create({
        user: req.user._id,
        mandap: mandapId,
        vendor: mandap.vendor._id,
        customDesign: customDesignId || undefined,
        eventDate: new Date(eventDate),
        eventTime,
        eventType,
        guestCount,
        baseAmount,
        customizationAmount: addons,
        taxAmount,
        totalAmount,
        advanceAmount,
        venueAddress,
        specialRequests,
    });

    // Increment booking count
    mandap.bookingCount += 1;
    await mandap.save({ validateBeforeSave: false });

    // Notify vendor
    await Notification.create({
        recipient: mandap.vendor.user,
        type: 'booking_confirmed',
        title: 'New Booking Received',
        message: `New booking received for ${mandap.title} on ${new Date(eventDate).toDateString()}`,
        data: new Map([['bookingId', booking._id.toString()]]),
        link: `/dashboard/vendor/bookings/${booking._id}`,
    });

    // Send email
    try {
        await sendEmail({
            to: req.user.email,
            subject: `Booking Confirmed – ${booking.bookingRef}`,
            html: `<h2>Your booking is confirmed!</h2>
        <p>Booking Reference: <strong>${booking.bookingRef}</strong></p>
        <p>Mandap: ${mandap.title}</p>
        <p>Date: ${new Date(eventDate).toDateString()}</p>
        <p>Total Amount: ₹${totalAmount.toLocaleString()}</p>
        <p>Advance to pay now: ₹${advanceAmount.toLocaleString()}</p>`,
        });
    } catch (_) { }

    await booking.populate(['mandap', { path: 'vendor', select: 'businessName phone' }]);
    res.status(201).json({ success: true, data: booking });
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };
    if (req.query.status) query.status = req.query.status;

    const [bookings, total] = await Promise.all([
        Booking.find(query)
            .populate('mandap', 'title images location')
            .populate('vendor', 'businessName phone')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit),
        Booking.countDocuments(query),
    ]);

    res.json({ success: true, data: bookings, pagination: { total, page, limit } });
};

// @desc    Get vendor bookings
// @route   GET /api/bookings/vendor
// @access  Vendor
exports.getVendorBookings = async (req, res) => {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = { vendor: vendor._id };
    if (req.query.status) query.status = req.query.status;

    const [bookings, total] = await Promise.all([
        Booking.find(query)
            .populate('user', 'name email phone')
            .populate('mandap', 'title images')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(limit),
        Booking.countDocuments(query),
    ]);

    res.json({ success: true, data: bookings, pagination: { total, page, limit } });
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate('user', 'name email phone avatar')
        .populate('mandap')
        .populate({ path: 'vendor', populate: { path: 'user', select: 'name email' } });

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Authorization
    const isOwner = booking.user._id.toString() === req.user._id.toString();
    const isVendorUser = booking.vendor?.user?._id?.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isVendorUser && !isAdmin) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: booking });
};

// @desc    Update booking status (vendor/admin)
// @route   PUT /api/bookings/:id/status
// @access  Vendor / Admin
exports.updateBookingStatus = async (req, res) => {
    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id).populate('user', 'email name');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    booking.status = status;
    if (status === 'cancelled') {
        booking.cancellationReason = cancellationReason;
        booking.cancelledBy = req.user.role;
        booking.cancelledAt = new Date();
    }
    if (status === 'confirmed') booking.confirmedAt = new Date();
    if (status === 'completed') booking.completedAt = new Date();

    await booking.save();

    // Notify user
    await Notification.create({
        recipient: booking.user._id,
        type: `booking_${status === 'confirmed' ? 'confirmed' : status === 'cancelled' ? 'cancelled' : 'completed'}`,
        title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your booking ${booking.bookingRef} has been ${status}`,
        link: `/dashboard/user/bookings/${booking._id}`,
    });

    res.json({ success: true, data: booking });
};

// @desc    Cancel booking (user)
// @route   DELETE /api/bookings/:id
// @access  Private (user)
exports.cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
        return res.status(400).json({ success: false, message: 'Cannot cancel this booking' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    booking.cancelledBy = 'user';
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled successfully' });
};

// @desc    Admin: Get all bookings
// @route   GET /api/bookings/admin
// @access  Admin
exports.getAllBookings = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const query = {};
    if (req.query.status) query.status = req.query.status;

    const [bookings, total] = await Promise.all([
        Booking.find(query)
            .populate('user', 'name email')
            .populate('mandap', 'title')
            .populate('vendor', 'businessName')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(limit),
        Booking.countDocuments(query),
    ]);

    res.json({ success: true, data: bookings, pagination: { total, page, limit } });
};
