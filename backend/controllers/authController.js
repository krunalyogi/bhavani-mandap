const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const sendEmail = require('../utils/sendEmail');

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

const signRefreshToken = (id) =>
    jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' });

const sendTokenResponse = (user, statusCode, res) => {
    const token = signToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.status(statusCode).json({
        success: true,
        token,
        refreshToken,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            isVerified: user.isVerified,
        },
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { name, email, password, phone, role, businessName, city, state, referralCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Handle referral
    let referrer = null;
    if (referralCode) {
        referrer = await User.findOne({ referralCode });
        if (referrer) referrer.totalReferrals += 1;
    }

    const userRef = `BM${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const user = await User.create({
        name,
        email,
        password,
        phone,
        role: role === 'vendor' ? 'vendor' : 'user',
        referralCode: userRef,
        referredBy: referrer?._id,
    });

    if (referrer) await referrer.save();

    // If registering as vendor, create vendor profile
    if (role === 'vendor') {
        await Vendor.create({
            user: user._id,
            businessName: businessName || name,
            phone,
            address: { city: city || '', state: state || '' },
        });
    }

    // Send welcome email
    try {
        await sendEmail({
            to: user.email,
            subject: 'Welcome to Bhavani Mandap 🙏',
            html: `<h2>Welcome, ${user.name}!</h2><p>Your account has been created successfully. Start exploring our premium mandap designs.</p>`,
        });
    } catch (_) { }

    sendTokenResponse(user, 201, res);
};

// @desc    Register admin (Secret Route)
// @route   POST /api/auth/admin-register
// @access  Public (with secret key)
exports.adminRegister = async (req, res) => {
    const { name, email, password, phone, secret } = req.body;

    if (!secret || secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Invalid admin secret.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const userRef = `BM${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const user = await User.create({
        name,
        email,
        password,
        phone,
        role: 'admin',
        referralCode: userRef,
    });

    sendTokenResponse(user, 201, res);
};

// @desc    Login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
        return res.status(403).json({ success: false, message: 'Account has been deactivated' });
    }

    sendTokenResponse(user, 200, res);
};

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Public
exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const token = signToken(user._id);
    res.json({ success: true, token });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist', 'title images basePrice location');
    res.json({ success: true, user });
};

// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const { name, phone, address, notificationPreferences } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, phone, address, notificationPreferences },
        { new: true, runValidators: true }
    );
    res.json({ success: true, user });
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword))) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
};

// @desc    Logout
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
};
