const express = require('express');
const router = express.Router();
const CustomDesign = require('../models/CustomDesign');
const { protect } = require('../middleware/auth');

// Save a custom design
router.post('/', protect, async (req, res) => {
    const design = await CustomDesign.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: design });
});

// Get user's saved designs
router.get('/my', protect, async (req, res) => {
    const designs = await CustomDesign.find({ user: req.user._id, isSaved: true })
        .populate('mandap', 'title images')
        .sort('-createdAt');
    res.json({ success: true, data: designs });
});

// Get single design
router.get('/:id', protect, async (req, res) => {
    const design = await CustomDesign.findById(req.params.id);
    if (!design) return res.status(404).json({ success: false, message: 'Design not found' });
    res.json({ success: true, data: design });
});

// Update design
router.put('/:id', protect, async (req, res) => {
    const design = await CustomDesign.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        req.body,
        { new: true }
    );
    if (!design) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: design });
});

// Delete design
router.delete('/:id', protect, async (req, res) => {
    await CustomDesign.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ success: true, message: 'Deleted' });
});

module.exports = router;
