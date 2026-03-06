const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true, trim: true },
        slug: { type: String, unique: true },
        description: String,
        image: { url: String, publicId: String },
        icon: String, // emoji or icon name
        isActive: { type: Boolean, default: true },
        displayOrder: { type: Number, default: 0 },
        mandapCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

CategorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    }
    next();
});

module.exports = mongoose.model('Category', CategorySchema);
