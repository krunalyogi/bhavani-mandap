const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        businessName: {
            type: String,
            required: [true, 'Business name is required'],
            trim: true,
            maxlength: 150,
        },
        description: { type: String, maxlength: 1000 },
        logo: {
            url: { type: String, default: '' },
            publicId: String,
        },
        coverImage: {
            url: { type: String, default: '' },
            publicId: String,
        },
        gstNumber: { type: String, sparse: true },
        panNumber: { type: String },
        bankDetails: {
            accountHolder: String,
            accountNumber: String,
            ifscCode: String,
            bankName: String,
        },
        address: {
            street: String,
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: String,
        },
        serviceAreas: [String], // list of cities/pincodes served
        phone: { type: String, required: true },
        alternatePhone: String,
        whatsapp: String,
        status: {
            type: String,
            enum: ['pending', 'approved', 'suspended', 'rejected'],
            default: 'pending',
        },
        isVerified: { type: Boolean, default: false },
        ratings: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 },
        },
        totalEarnings: { type: Number, default: 0 },
        completedBookings: { type: Number, default: 0 },
        cancelledBookings: { type: Number, default: 0 },
        socialLinks: {
            instagram: String,
            facebook: String,
            youtube: String,
        },
        documents: [
            {
                name: String,
                url: String,
                publicId: String,
            },
        ],
        yearsOfExperience: { type: Number, min: 0 },
        teamSize: { type: Number, min: 1 },
        tags: [String],
    },
    { timestamps: true }
);

VendorSchema.index({ 'address.city': 1, status: 1 });
VendorSchema.index({ 'ratings.average': -1 });

VendorSchema.virtual('mandaps', {
    ref: 'MandapDesign',
    localField: '_id',
    foreignField: 'vendor',
});

VendorSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Vendor', VendorSchema);
