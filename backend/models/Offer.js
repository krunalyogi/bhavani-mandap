const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, maxlength: 200 },
        description: String,
        type: {
            type: String,
            enum: ['banner', 'seasonal', 'coupon', 'flash_sale', 'referral'],
            required: true,
        },
        image: { url: String, publicId: String },
        ctaLabel: String,
        ctaLink: String,
        couponCode: { type: String, sparse: true, uppercase: true },
        discountType: { type: String, enum: ['percentage', 'flat'] },
        discountValue: Number,
        minOrderAmount: { type: Number, default: 0 },
        maxDiscountAmount: Number,
        usageLimit: Number,
        usedCount: { type: Number, default: 0 },
        validFrom: Date,
        validTill: Date,
        isActive: { type: Boolean, default: true, index: true },
        targetCity: [String],
        displayOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

OfferSchema.index({ isActive: 1, validTill: 1 });

module.exports = mongoose.model('Offer', OfferSchema);
