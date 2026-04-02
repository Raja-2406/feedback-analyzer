const mongoose = require('mongoose');
const User = require('./models/User');
const Feedback = require('./models/Feedback');
require('dotenv').config();

const testDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/feedpulse');
        console.log('Connected to DB for verification test.');

        const admin = await User.findOne({ role: 'admin' });
        const customers = await User.find({ role: 'customer' });
        const feedbackCount = await Feedback.countDocuments();

        console.log(`Found admin: ${admin ? admin.email : 'None'}`);
        console.log(`Found ${customers.length} customers.`);
        console.log(`Total feedback documents: ${feedbackCount}`);

    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        mongoose.connection.close();
    }
};

testDb();
