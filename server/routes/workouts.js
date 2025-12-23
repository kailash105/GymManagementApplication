const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Workout = require('../models/Workout');

// @route   GET api/workouts
// @desc    Get all workouts for logged in user (or assigned to them)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // If trainer, maybe see workouts they created? 
        // If member, see workouts assigned to them?
        // Start with: find workouts where assignedMemberId is user OR trainerId is user
        const workouts = await Workout.find({
            $or: [{ assignedMemberId: req.user.id }, { trainerId: req.user.id }],
        }).sort({ date: -1 });

        res.json(workouts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/workouts
// @desc    Create a workout
// @access  Private (Trainer/Owner)
router.post('/', auth, async (req, res) => {
    const { title, assignedMemberId, exercises } = req.body;

    try {
        console.log('Creating workout:', { title, assignedMemberId, exercises, trainerId: req.user.id });

        // Basic check for title and exercises
        if (!title || !exercises) {
            console.log('Missing title or exercises');
            return res.status(400).json({ msg: 'Please include title and exercises' });
        }

        const newWorkout = new Workout({
            title,
            trainerId: req.user.id,
            assignedMemberId,
            exercises,
        });

        const workout = await newWorkout.save();
        res.json(workout);
    } catch (err) {
        console.error('Workout save error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
