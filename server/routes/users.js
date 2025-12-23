const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   POST api/users
// @desc    Create a new user (Member)
// @access  Private (Owner/Trainer)
router.post('/', auth, async (req, res) => {
    const { name, email, role } = req.body;
    const bcrypt = require('bcryptjs'); // Need bcrypt here too or move to top

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password: 'password123', // Default password for added members
            role: role || 'MEMBER',
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users
// @desc    Get all users (Owner/Trainer only ideally, but simplifying for now)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users/trainers
// @desc    Get all trainers
// @access  Private
router.get('/trainers', auth, async (req, res) => {
    try {
        const trainers = await User.find({ role: 'TRAINER' }).select('-password');
        res.json(trainers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/users/:id
// @desc    Update user (e.g. assign plan or trainer)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, email, role, assignedTrainer, plan } = req.body;

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (role) userFields.role = role;
    if (assignedTrainer) userFields.assignedTrainer = assignedTrainer;
    if (plan) userFields.plan = plan;

    try {
        let user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Make sure user owns user or is admin/owner
        // Assuming for now any auth user can edit strictly for simplicity in MVP or add role check
        // if (user.id !== req.user.id && req.user.role !== 'owner') {
        //   return res.status(401).json({ msg: 'Not authorized' });
        // }

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private (Owner only ideally)
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({ msg: 'User removed' });
    } catch (err) {
        console.error('Delete user error:', err.message);
        if (err.kind == 'ObjectId') {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
