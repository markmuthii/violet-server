const mongoose = require('mongoose');

const SwapSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalBook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    swappedBook: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    swapStatus: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    }
});

module.exports = mongoose.model('Swap', SwapSchema);