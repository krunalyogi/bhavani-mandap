const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema(
    {
        room: {
            type: String,
            required: true,
            index: true,
            // Convention: `${userId}_${vendorId}` (sorted IDs)
        },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        senderRole: { type: String, enum: ['user', 'vendor', 'admin'], required: true },

        messageType: {
            type: String,
            enum: ['text', 'image', 'file', 'booking_link', 'system'],
            default: 'text',
        },
        content: { type: String, required: true },
        mediaUrl: String,
        mediaPublicId: String,

        isRead: { type: Boolean, default: false },
        readAt: Date,
        isDeleted: { type: Boolean, default: false },

        booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }, // Optional booking context
    },
    { timestamps: true }
);

ChatMessageSchema.index({ room: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
