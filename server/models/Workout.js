const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    assignedMemberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    exercises: [
        {
            name: { type: String, required: true },
            sets: { type: String, required: true },
            reps: { type: String, required: true },
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Workout', WorkoutSchema);
