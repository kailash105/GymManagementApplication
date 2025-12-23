const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
    {
        name: 'John Owner',
        email: 'owner@gym.com',
        password: 'password123',
        role: 'OWNER'
    },
    {
        name: 'Mike Trainer',
        email: 'trainer@gym.com',
        password: 'password123',
        role: 'TRAINER'
    },
    {
        name: 'Sarah Member',
        email: 'member@gym.com',
        password: 'password123',
        role: 'MEMBER'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gym-app');
        console.log('MongoDB Connected...');

        await User.deleteMany(); // Clear existing users
        console.log('Users cleared...');

        for (const user of users) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            await new User(user).save();
        }

        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
