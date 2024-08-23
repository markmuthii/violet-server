const mongoose = require('mongoose');
const User = require('./user');

const BookSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    description : {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        enum: [1,2,3,4,5],
        default: 3
    },
    personalComments: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0,
        min: 0
    },
    statusOfBook: {
        type: String,
        required: true,
        enum: ['available', 'not available'],
        default: 'available'
    },
    stateOfBook: {
        type: String,
        required: true,
        enum: ['new', 'second-hand(used)', 'digital-copy']
    }
    ,image: {
        type: String,
       //required: true
    }, file:{
        type: String,
 
    }
});

module.exports = mongoose.model('Book', BookSchema);