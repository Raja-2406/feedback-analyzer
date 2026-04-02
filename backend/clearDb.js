const mongoose = require('mongoose');
require('dotenv').config();
const Feedback = require('./models/Feedback');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        try {
            const result = await Feedback.deleteMany({});
            console.log(`Deleted ${result.deletedCount} documents.`);
        } catch (err) {
            console.error('Error deleting documents:', err);
        } finally {
            mongoose.disconnect();
            process.exit(0);
        }
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });
