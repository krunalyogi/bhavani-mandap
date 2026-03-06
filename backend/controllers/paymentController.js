const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create Razorpay order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res) => {
    const { bookingId, paymentType } = req.body;

    const booking = await Booking.findById(bookingId).populate('user', 'name email phone');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const amountToPay = paymentType === 'full' ? booking.totalAmount : booking.advanceAmount;

    const razorpayOrder = await razorpay.orders.create({
        amount: amountToPay * 100, // convert to paise
        currency: 'INR',
        receipt: `receipt_${bookingId}_${Date.now()}`,
        notes: {
            bookingId: bookingId.toString(),
            bookingRef: booking.bookingRef,
            userId: req.user._id.toString(),
        },
    });

    // Save payment record
    const payment = await Payment.create({
        booking: bookingId,
        user: req.user._id,
        vendor: booking.vendor,
        razorpayOrderId: razorpayOrder.id,
        amount: amountToPay * 100,
        paymentType: paymentType || 'advance',
        receipt: razorpayOrder.receipt,
    });

    res.json({
        success: true,
        order: razorpayOrder,
        paymentId: payment._id,
        key: process.env.RAZORPAY_KEY_ID,
        prefill: {
            name: booking.user.name,
            email: booking.user.email,
            contact: booking.user.phone,
        },
    });
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId, bookingId } = req.body;

    // Verify signature
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        await Payment.findByIdAndUpdate(paymentId, { status: 'failed' });
        return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Fetch payment details from Razorpay
    const rpPayment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update payment record
    const payment = await Payment.findByIdAndUpdate(
        paymentId,
        {
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: 'captured',
            method: rpPayment.method || 'unknown',
            paidAt: new Date(),
            vendorShareAmount: Math.round((payment?.amount || 0) * 0.9 / 100), // 90% to vendor
        },
        { new: true }
    );

    // Update booking payment status
    const booking = await Booking.findById(bookingId);
    if (booking) {
        booking.paymentStatus = payment.paymentType === 'full' ? 'fully_paid' : 'advance_paid';
        if (booking.status === 'pending') booking.status = 'confirmed';
        await booking.save();
    }

    // Notify user
    await Notification.create({
        recipient: req.user._id,
        type: 'payment_received',
        title: 'Payment Successful',
        message: `Payment of ₹${(payment.amount / 100).toLocaleString()} received for booking ${booking?.bookingRef}`,
        link: `/dashboard/user/bookings/${bookingId}`,
    });

    // Send confirmation email
    try {
        await sendEmail({
            to: req.user.email,
            subject: `Payment Confirmed – ₹${(payment.amount / 100).toLocaleString()}`,
            html: `<h2>Payment Successful! 🎉</h2>
        <p>Amount Paid: ₹${(payment.amount / 100).toLocaleString()}</p>
        <p>Payment ID: ${razorpay_payment_id}</p>
        <p>Your booking is now confirmed. Our team will contact you shortly.</p>`,
        });
    } catch (_) { }

    res.json({ success: true, message: 'Payment verified successfully', payment });
};

// @desc    Get payment history (user)
// @route   GET /api/payments/my
// @access  Private
exports.getMyPayments = async (req, res) => {
    const payments = await Payment.find({ user: req.user._id })
        .populate('booking', 'bookingRef eventDate status')
        .sort('-createdAt');
    res.json({ success: true, data: payments });
};

// @desc    Razorpay webhook handler
// @route   POST /api/payments/webhook
// @access  Public (Razorpay signs it)
exports.webhook = async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (expectedSignature !== signature) {
        return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const { event, payload } = req.body;

    if (event === 'payment.captured') {
        const orderId = payload.payment.entity.order_id;
        await Payment.findOneAndUpdate({ razorpayOrderId: orderId }, { status: 'captured' });
    }

    if (event === 'refund.processed') {
        const orderId = payload.refund.entity.payment_id;
        await Payment.findOneAndUpdate(
            { razorpayPaymentId: orderId },
            { status: 'refunded', 'refund.status': 'processed', 'refund.processedAt': new Date() }
        );
    }

    res.json({ success: true });
};

// @desc    Admin: Get all payments + analytics
// @route   GET /api/payments/admin
// @access  Admin
exports.getAllPayments = async (req, res) => {
    const [payments, stats] = await Promise.all([
        Payment.find()
            .populate('user', 'name email')
            .populate('booking', 'bookingRef eventDate')
            .sort('-createdAt')
            .limit(50),
        Payment.aggregate([
            { $match: { status: 'captured' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                    totalTransactions: { $sum: 1 },
                    avgTransaction: { $avg: '$amount' },
                },
            },
        ]),
    ]);

    res.json({
        success: true,
        data: payments,
        stats: stats[0]
            ? {
                totalRevenue: stats[0].totalRevenue / 100,
                totalTransactions: stats[0].totalTransactions,
                avgTransaction: stats[0].avgTransaction / 100,
            }
            : {},
    });
};
