const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/alerts
router.get('/', async (req, res) => {
    try {
        // In a real app, logic would check expiration dates etc.
        const alerts = [
            {
                id: '1',
                type: 'warning',
                title: 'Subscription Expiring',
                message: '5 members have subscriptions expiring this week.',
                date: new Date().toISOString()
            },
            {
                id: '2',
                type: 'info',
                title: 'New Trainer Added',
                message: 'Sarah Jenkins was added as a trainer.',
                date: new Date(Date.now() - 86400000).toISOString() // Yesterday
            },
            {
                id: '3',
                type: 'error',
                title: 'Payment Failed',
                message: 'Payment failed for Member John Doe.',
                date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
            }
        ];

        res.json(alerts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
