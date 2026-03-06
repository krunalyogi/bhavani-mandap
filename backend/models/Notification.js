const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
    {
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        type: {
            type: String,
            enum: [
                'booking_confirmed', 'booking_cancelled', 'booking_completed',
                'payment_received', 'payment_failed', 'payment_refunded',
                'review_received', 'review_approved', 'new_message',
                'offer_available', 'vendor_approved', 'vendor_rejected',
                'system', 'reminder',
            ],
            required: true,
        },
        title: { type: String, required: true },
        message: { type: String, required: true },
        data: { type: Map, of: String }, // Extra payload (bookingId, etc.)
        isRead: { type: Boolean, default: false, index: true },
        readAt: Date,
        link: String, // Frontend URL to navigate
        icon: String,
    },
    { timestamps: true }
);

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
