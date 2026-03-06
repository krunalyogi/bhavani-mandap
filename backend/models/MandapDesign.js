const mongoose = require('mongoose');

const MandapDesignSchema = new mongoose.Schema(
    {
        vendor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Vendor',
            required: true,
            index: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: 200,
        },
        slug: { type: String, unique: true, index: true },
        description: { type: String, maxlength: 2000 },
        shortDescription: { type: String, maxlength: 300 },

        images: [
            {
                url: { type: String, required: true },
                publicId: String,
                alt: String,
                isPrimary: { type: Boolean, default: false },
            },
        ],

        basePrice: { type: Number, required: true, min: 0 },
        discountedPrice: { type: Number, min: 0 },
        priceUnit: { type: String, enum: ['per_event', 'per_day'], default: 'per_event' },

        capacity: {
            min: { type: Number, default: 50 },
            max: { type: Number, default: 500 },
        },

        location: {
            city: { type: String, required: true, index: true },
            state: String,
            pincode: String,
        },

        decorationStyles: [
            { type: String, enum: ['traditional', 'modern', 'royal', 'floral', 'minimalist', 'fusion'] }
        ],

        services: [
            {
                name: String,
                description: String,
                included: { type: Boolean, default: true },
                additionalCost: { type: Number, default: 0 },
            },
        ],

        customizationOptions: {
            flowerTypes: [{ name: String, priceAddon: Number }],
            colorThemes: [{ name: String, hexCode: String, priceAddon: Number }],
            lightingOptions: [{ name: String, priceAddon: Number }],
            fabricStyles: [{ name: String, priceAddon: Number }],
        },

        availability: {
            blockedDates: [Date],
            advanceBookingDays: { type: Number, default: 1 },
            maxBookingDaysAhead: { type: Number, default: 365 },
        },

        ratings: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 },
        },

        wishlistCount: { type: Number, default: 0 },
        viewCount: { type: Number, default: 0 },
        bookingCount: { type: Number, default: 0 },

        tags: [String],
        isFeatured: { type: Boolean, default: false, index: true },
        isActive: { type: Boolean, default: true, index: true },
        isBestseller: { type: Boolean, default: false },

        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [String],
        },
    },
    { timestamps: true }
);

// Auto-generate slug
MandapDesignSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();
    }
    next();
});

// Effective price virtual
MandapDesignSchema.virtual('effectivePrice').get(function () {
    return this.discountedPrice || this.basePrice;
});

// Discount percentage virtual
MandapDesignSchema.virtual('discountPercent').get(function () {
    if (this.discountedPrice && this.basePrice > this.discountedPrice) {
        return Math.round(((this.basePrice - this.discountedPrice) / this.basePrice) * 100);
    }
    return 0;
});

MandapDesignSchema.set('toJSON', { virtuals: true });
MandapDesignSchema.index({ 'location.city': 1, isActive: 1, 'ratings.average': -1 });
MandapDesignSchema.index({ tags: 1 });
MandapDesignSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('MandapDesign', MandapDesignSchema);
