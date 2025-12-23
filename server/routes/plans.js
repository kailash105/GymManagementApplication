const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Plan = require('../models/Plan');

// @route   GET api/plans
// @desc    Get all plans
// @access  Public (or Private)
router.get('/', async (req, res) => {
    try {
        const plans = await Plan.find();
        res.json(plans);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/plans
// @desc    Create a plan
// @access  Private (Owner only)
router.post('/', auth, async (req, res) => {
    const { name, price, durationMonths } = req.body;

    try {
        const newPlan = new Plan({
            name,
            price,
            durationMonths,
        });

        const plan = await newPlan.save();
        res.json(plan);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
