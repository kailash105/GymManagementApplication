const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const Attendance = require('../models/Attendance'); // Future integration

// GET /api/reports/revenue
router.get('/revenue', async (req, res) => {
    try {
        const members = await User.find({ role: 'MEMBER' });
        // Mock revenue calculation: $50 per member
        const currentRevenue = members.length * 50;

        // Mock historical data (last 6 months)
        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const data = [
            currentRevenue * 0.8,
            currentRevenue * 0.85,
            currentRevenue * 0.9,
            currentRevenue * 0.95,
            currentRevenue * 0.92,
            currentRevenue
        ];

        res.json({
            total: currentRevenue,
            chartData: {
                labels,
                datasets: [{ data }]
            },
            growth: "+12.5%"
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/reports/growth
router.get('/growth', async (req, res) => {
    try {
        // Mock growth data
        const data = {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
            datasets: [{
                data: [5, 8, 12, 7] // New members per week
            }]
        };
        res.json(data);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
