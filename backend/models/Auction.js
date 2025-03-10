const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startingBid: {
        type: Number,
        required: true,
        min: 0
    },
    currentBid: {
        type: Number,
        default: function() {
            return this.startingBid;
        }
    },
    closingTime: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['electronics', 'fashion', 'home', 'sports', 'art', 'other']
    },
    condition: {
        type: String,
        required: true,
        enum: ['new', 'like-new', 'good', 'fair', 'poor']
    },
    imageUrl: {
        type: String
    },
    seller: {
        type: String,
        required: true
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    highestBidder: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

const Auction = mongoose.model('Auction', auctionSchema);
module.exports = Auction; 