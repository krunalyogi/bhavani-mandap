const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        mandap: { type: mongoose.Schema.Types.ObjectId, ref: 'MandapDesign', required: true, index: true },
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
        customDesign: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomDesign' },

        eventDate: { type: Date, required: [true, 'Event date is required'], index: true },
        eventTime: { type: String, required: true }, // "09:00 AM"
        eventDuration: { type: Number, default: 1 }, // in days

        eventType: {
            type: String,
            enum: ['wedding', 'engagement', 'reception', 'haldi', 'mehendi', 'sangeet', 'other'],
            default: 'wedding',
        },

        guestCount: { type: Number, required: true, min: 1 },

        // Pricing breakdown
        baseAmount: { type: Number, required: true },
        customizationAmount: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        discountAmount: { type: Number, default: 0 },
        totalAmount: { type: Number, required: true },
        advanceAmount: { type: Number, required: true }, // 30% advance
        remainingAmount: { type: Number },

        status: {
            type: String,
            enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'],
            default: 'pending',
            index: true,
        },

        paymentStatus: {
            type: String,
            enum: ['unpaid', 'advance_paid', 'fully_paid', 'refunded'],
            default: 'unpaid',
        },

        venueAddress: {
            street: String,
            city: String,
            state: String,
            pincode: String,
            landmark: String,
        },

        specialRequests: { type: String, maxlength: 500 },
        cancellationReason: String,
        cancelledBy: { type: String, enum: ['user', 'vendor', 'admin'] },
        cancelledAt: Date,

        confirmedAt: Date,
        completedAt: Date,

        bookingRef: { type: String, unique: true },
        isReviewed: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Auto-generate booking reference
BookingSchema.pre('save', function (next) {
    if (!this.bookingRef) {
        this.bookingRef = 'BM' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(2, 5).toUpperCase();
    }
    if (!this.remainingAmount) {
        this.remainingAmount = this.totalAmount - this.advanceAmount;
    }
    next();
});

BookingSchema.index({ user: 1, status: 1 });
BookingSchema.index({ vendor: 1, eventDate: 1 });
BookingSchema.index({ mandap: 1, eventDate: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
