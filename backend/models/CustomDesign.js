const mongoose = require('mongoose');

const CustomDesignSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        mandap: { type: mongoose.Schema.Types.ObjectId, ref: 'MandapDesign', required: true },

        name: { type: String, default: 'My Custom Design', maxlength: 100 },

        selections: {
            flowerType: { name: String, priceAddon: { type: Number, default: 0 } },
            colorTheme: { name: String, hexCode: String, priceAddon: { type: Number, default: 0 } },
            lighting: { name: String, priceAddon: { type: Number, default: 0 } },
            fabricStyle: { name: String, priceAddon: { type: Number, default: 0 } },
            extraServices: [{ name: String, priceAddon: Number }],
        },

        canvasSnapshot: String, // Base64 or Cloudinary URL of the canvas preview
        totalAddonPrice: { type: Number, default: 0 },
        notes: { type: String, maxlength: 500 },
        isSaved: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('CustomDesign', CustomDesignSchema);
