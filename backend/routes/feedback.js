const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const { auth, admin } = require('../middleware/auth');
const { validateFeedback, validateUpdateFeedback } = require('../middleware/validation');

// GET /api/feedback/stats - Public route for landing page live stats
router.get('/stats', async (req, res) => {
    try {
        const totalFeedbacks = await Feedback.countDocuments();

        // Aggregate to find average rating
        const avgRatingResult = await Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: '$rating' } } }
        ]);
        const averageRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;

        // Count sentiments
        const positiveCount = await Feedback.countDocuments({ sentiment: 'positive' });
        const neutralCount = await Feedback.countDocuments({ sentiment: 'neutral' });
        const negativeCount = await Feedback.countDocuments({ sentiment: 'negative' });

        res.json({
            total: totalFeedbacks,
            averageRating: averageRating,
            sentiments: {
                positive: positiveCount,
                neutral: neutralCount,
                negative: negativeCount
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats', error: err.message });
    }
});

// GET /api/feedback - Retrieve feedback (Customers see their own, Admins see all)
router.get('/', auth, async (req, res) => {
    try {
        let filter = {};

        // If customer, only show their own feedback
        if (req.user.role === 'customer') {
            filter.userId = req.user.id;
        }

        // If admin, they can see all. Optional: filter by userId if provided in query
        if (req.user.role === 'admin' && req.query.userId) {
            filter.userId = req.query.userId;
        }

        const feedback = await Feedback.find(filter).sort({ createdAt: -1 });
        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/feedback - Create new feedback
router.post('/', auth, validateFeedback, async (req, res) => {
    const { userName, category, rating, comment } = req.body;

    // Accept the client-computed sentiment directly from Puter.js
    const calculatedSentiment = req.body.sentiment || 'neutral';

    const newFeedback = new Feedback({
        userId: req.user.id, // Use ID from token, not body
        userName,
        category,
        rating,
        comment,
        sentiment: calculatedSentiment,
    });

    try {
        const savedFeedback = await newFeedback.save();
        res.status(201).json(savedFeedback);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT /api/feedback/:id - Update feedback
router.put('/:id', auth, validateUpdateFeedback, async (req, res) => {
    try {
        let feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Check user authorization (Admin or owner of the feedback)
        if (req.user.role !== 'admin' && feedback.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this feedback' });
        }

        feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.json(feedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/feedback/:id - Delete feedback
router.delete('/:id', auth, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Check user authorization (Admin or owner of the feedback)
        if (req.user.role !== 'admin' && feedback.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this feedback' });
        }

        await Feedback.findByIdAndDelete(req.params.id);
        res.status(204).send(); // Standard for successful delete without body
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// POST /api/feedback/:id/messages - Add a message to a feedback thread
router.post('/:id/messages', auth, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Message text is required' });
        }

        let feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        // Check user authorization (Admin or owner of the feedback)
        if (req.user.role !== 'admin' && feedback.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to comment on this feedback' });
        }

        const senderName = req.user.name || (req.user.role === 'admin' ? 'Support Admin' : 'Customer');

        feedback.messages.push({
            senderRole: req.user.role,
            senderName: senderName,
            text: text
        });

        const updatedFeedback = await feedback.save();
        res.status(201).json(updatedFeedback);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
