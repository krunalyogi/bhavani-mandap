const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        mandap: { type: mongoose.Schema.Types.ObjectId, ref: 'MandapDesign', required: true, index: true },
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
        booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },

        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String, maxlength: 100 },
        comment: { type: String, required: true, maxlength: 1000 },

        images: [
            {
                url: String,
                publicId: String,
            },
        ],

        subRatings: {
            decoration: { type: Number, min: 1, max: 5 },
            punctuality: { type: Number, min: 1, max: 5 },
            valueForMoney: { type: Number, min: 1, max: 5 },
            staffBehavior: { type: Number, min: 1, max: 5 },
        },

        vendorReply: {
            comment: String,
            repliedAt: Date,
        },

        isVerified: { type: Boolean, default: false }, // verified purchase
        isApproved: { type: Boolean, default: true },
        isHidden: { type: Boolean, default: false }, // admin moderation
        helpfulCount: { type: Number, default: 0 },
        helpfulVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

ReviewSchema.index({ mandap: 1, isApproved: 1 });
ReviewSchema.index({ vendor: 1 });

// Update mandap & vendor ratings after save
ReviewSchema.post('save', async function () {
    const MandapDesign = mongoose.model('MandapDesign');
    const Vendor = mongoose.model('Vendor');

    const mandapStats = await mongoose.model('Review').aggregate([
        { $match: { mandap: this.mandap, isApproved: true } },
        { $group: { _id: '$mandap', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (mandapStats.length > 0) {
        await MandapDesign.findByIdAndUpdate(this.mandap, {
            'ratings.average': Math.round(mandapStats[0].avg * 10) / 10,
            'ratings.count': mandapStats[0].count,
        });
        await Vendor.findByIdAndUpdate(this.vendor, {
            'ratings.average': Math.round(mandapStats[0].avg * 10) / 10,
            'ratings.count': mandapStats[0].count,
        });
    }
});

module.exports = mongoose.model('Review', ReviewSchema);
