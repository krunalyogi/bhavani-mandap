const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
    {
        booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },

        // Razorpay
        razorpayOrderId: { type: String, required: true, unique: true },
        razorpayPaymentId: { type: String, sparse: true },
        razorpaySignature: String,

        amount: { type: Number, required: true }, // in paise
        currency: { type: String, default: 'INR' },
        paymentType: {
            type: String,
            enum: ['advance', 'final', 'full', 'refund'],
            default: 'advance',
        },
        method: {
            type: String,
            enum: ['upi', 'card', 'netbanking', 'wallet', 'emi', 'unknown'],
            default: 'unknown',
        },

        status: {
            type: String,
            enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
            default: 'created',
            index: true,
        },

        refund: {
            refundId: String,
            amount: Number,
            reason: String,
            status: { type: String, enum: ['pending', 'processed', 'failed'] },
            processedAt: Date,
        },

        receipt: String,
        notes: { type: Map, of: String },
        paidAt: Date,
        vendorPaidAt: Date,
        vendorShareAmount: Number, // Amount transferred to vendor (after platform commission)
        platformCommission: { type: Number, default: 10 }, // percentage
    },
    { timestamps: true }
);

PaymentSchema.index({ razorpayOrderId: 1 });
PaymentSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Payment', PaymentSchema);
