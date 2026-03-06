const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Vendor = require('./models/Vendor');
const Category = require('./models/Category');
const MandapDesign = require('./models/MandapDesign');

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clean up
        await MandapDesign.deleteMany({});
        await Category.deleteMany({});
        console.log('🗑️  Cleared old mandap designs and categories');

        // Create categories one by one so pre-save slug hook fires
        const catData = [
            { name: 'Mandap', icon: '🏯', description: 'Traditional and modern mandap setups', displayOrder: 1 },
            { name: 'Floral Decor', icon: '🌸', description: 'Fresh flower decoration packages', displayOrder: 2 },
            { name: 'Stage Setup', icon: '🎪', description: 'Reception and stage decoration', displayOrder: 3 },
        ];
        const categories = [];
        for (const c of catData) {
            categories.push(await Category.create(c));
        }
        console.log(`📂 Created ${categories.length} categories`);

        const mandapCat = categories[0]._id;
        const floralCat = categories[1]._id;
        const stageCat = categories[2]._id;

        // Find or create vendor user
        let vendorUser = await User.findOne({ role: 'vendor' });
        if (!vendorUser) {
            const hashedPassword = await bcrypt.hash('password123', 12);
            vendorUser = await User.create({
                name: 'Bhavani Decorators',
                email: 'vendor@bhavani.com',
                password: hashedPassword,
                role: 'vendor',
                phone: '9824520806',
                isVerified: true,
            });
            console.log('👤 Created sample vendor user');
        }

        // Find or create vendor profile
        let vendor = await Vendor.findOne({ user: vendorUser._id });
        if (!vendor) {
            vendor = await Vendor.create({
                user: vendorUser._id,
                businessName: 'Bhavani Mandap Decorators',
                phone: '9824520806',
                address: { city: 'Mumbai', state: 'Maharashtra' },
                isVerified: true,
                isActive: true,
            });
            console.log('🏪 Created vendor profile');
        }

        const vId = vendor._id;

        const mandapDesigns = [
            {
                vendor: vId, category: mandapCat,
                title: 'Golden Royal Mandap',
                description: 'A breathtaking golden mandap with intricate floral patterns and chandeliers. Perfect for large royal weddings.',
                basePrice: 150000, decorationStyles: ['royal'],
                location: { city: 'Mumbai', state: 'Maharashtra' },
                images: [{ url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80', publicId: 'seed1', isPrimary: true }],
                capacity: { min: 200, max: 1000 },
                tags: ['gold', 'royal', 'wedding', 'luxury'],
                isActive: true, isFeatured: true,
            },
            {
                vendor: vId, category: floralCat,
                title: 'Floral Blossom Mandap',
                description: 'Enchanting floral mandap bursting with roses, marigolds and orchids. A dream for flower lovers.',
                basePrice: 90000, decorationStyles: ['floral'],
                location: { city: 'Pune', state: 'Maharashtra' },
                images: [{ url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', publicId: 'seed2', isPrimary: true }],
                capacity: { min: 100, max: 500 },
                tags: ['flowers', 'roses', 'marigold', 'floral'],
                isActive: true, isFeatured: true,
            },
            {
                vendor: vId, category: mandapCat,
                title: 'Modern Minimalist Mandap',
                description: 'Clean, contemporary mandap design that lets the couple shine. Simple yet stunning.',
                basePrice: 60000, decorationStyles: ['minimalist', 'modern'],
                location: { city: 'Bengaluru', state: 'Karnataka' },
                images: [{ url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&q=80', publicId: 'seed3', isPrimary: true }],
                capacity: { min: 50, max: 300 },
                tags: ['modern', 'minimalist', 'contemporary'],
                isActive: true, isFeatured: false,
            },
            {
                vendor: vId, category: mandapCat,
                title: 'Maroon & Gold Heritage Mandap',
                description: 'A classic Indian heritage-inspired mandap with deep maroon drapes and gold detailing.',
                basePrice: 120000, decorationStyles: ['traditional'],
                location: { city: 'Jaipur', state: 'Rajasthan' },
                images: [{ url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80', publicId: 'seed4', isPrimary: true }],
                capacity: { min: 150, max: 800 },
                tags: ['traditional', 'heritage', 'maroon', 'gold'],
                isActive: true, isFeatured: true,
            },
            {
                vendor: vId, category: stageCat,
                title: 'Tropical Destination Mandap',
                description: 'A lush tropical mandap with palm leaves, exotic flowers and bright colours for an outdoor celebration.',
                basePrice: 80000, decorationStyles: ['fusion'],
                location: { city: 'Hyderabad', state: 'Telangana' },
                images: [{ url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80', publicId: 'seed5', isPrimary: true }],
                capacity: { min: 100, max: 400 },
                tags: ['tropical', 'outdoor', 'fusion', 'destination'],
                isActive: true, isFeatured: false,
            },
            {
                vendor: vId, category: mandapCat,
                title: 'Crystal Elegance Mandap',
                description: 'Draped in silk and adorned with Swarovski-style crystals, this mandap dazzles under lighting.',
                basePrice: 200000, decorationStyles: ['modern', 'royal'],
                location: { city: 'Delhi', state: 'Delhi' },
                images: [{ url: 'https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=800&q=80', publicId: 'seed6', isPrimary: true }],
                capacity: { min: 200, max: 1200 },
                tags: ['crystal', 'luxury', 'elegant', 'silk'],
                isActive: true, isFeatured: true,
            },
        ];

        // Use create for each so pre-save hooks (slug generation) fire
        for (const design of mandapDesigns) {
            await MandapDesign.create(design);
        }

        console.log(`🏯 Seeded ${mandapDesigns.length} mandap designs`);
        console.log('\n✨ Database seeded successfully!\n');
    } catch (error) {
        console.error('❌ Seeding failed:', error.message || error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seed();
