const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
            index: true,
        },
        phone: {
            type: String,
            match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian mobile number'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'vendor', 'admin'],
            default: 'user',
        },
        avatar: {
            url: { type: String, default: '' },
            publicId: String,
        },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MandapDesign' }],
        isVerified: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        refreshToken: { type: String, select: false },
        resetPasswordToken: String,
        resetPasswordExpire: Date,
        referralCode: { type: String, unique: true, sparse: true },
        referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        totalReferrals: { type: Number, default: 0 },
        notificationPreferences: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true },
        },
        address: {
            street: String,
            city: String,
            state: String,
            pincode: String,
        },
    },
    { timestamps: true }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.virtual('bookings', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'user',
});

UserSchema.set('toJSON', { virtuals: true });
UserSchema.index({ email: 1, role: 1 });

module.exports = mongoose.model('User', UserSchema);
