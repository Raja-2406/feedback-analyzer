const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const findUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/feedpulse');
        const user = await User.findOne({ email: 'trustinprogress24@gmail.com' });
        if (user) {
            console.log(`User found:`);
            console.log(`- Role: ${user.role}`);
            console.log(`- Has Password: ${!!user.password}`);
            console.log(`- Has Google ID: ${!!user.googleId}`);
        } else {
            console.log('User not found.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        mongoose.connection.close();
    }
};

findUser();
