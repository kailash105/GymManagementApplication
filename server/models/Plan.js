const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    durationMonths: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Plan', PlanSchema);
