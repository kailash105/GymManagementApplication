const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['OWNER', 'TRAINER', 'MEMBER'],
        default: 'MEMBER',
    },
    assignedTrainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', UserSchema);
