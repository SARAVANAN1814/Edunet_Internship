const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Auction = require('../models/Auction');

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only image files are allowed!'));
    }
});

// Create new auction with image upload
router.post('/auction', upload.single('image'), async (req, res) => {
    try {
        const {
            itemName,
            description,
            startingBid,
            closingTime,
            category,
            condition
        } = req.body;

        // Validate required fields
        const requiredFields = ['itemName', 'description', 'startingBid', 'closingTime', 'category', 'condition'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Additional validations
        if (parseFloat(startingBid) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Starting bid must be greater than 0'
            });
        }

        const selectedDate = new Date(closingTime);
        if (selectedDate <= new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Closing time must be in the future'
            });
        }

        // Create auction object
        const auctionData = {
            itemName,
            description,
            startingBid: parseFloat(startingBid),
            closingTime,
            category,
            condition,
            seller: req.body.username || 'Anonymous',
            currentBid: parseFloat(startingBid)
        };

        // Add image URL if image was uploaded
        if (req.file) {
            auctionData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const auction = new Auction(auctionData);
        const savedAuction = await auction.save();
        
        res.status(201).json({
            success: true,
            message: 'Auction created successfully',
            auction: savedAuction
        });
    } catch (error) {
        console.error('Auction creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error creating auction'
        });
    }
});

// Get all auctions
router.get('/auctions', async (req, res) => {
    try {
        const auctions = await Auction.find().sort({ createdAt: -1 });
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single auction
router.get('/auction/:id', async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json(auction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Place bid
router.post('/auction/:id/bid', async (req, res) => {
    try {
        const { amount, username } = req.body;
        
        if (!amount || !username) {
            return res.status(400).json({ 
                success: false,
                message: 'Bid amount and username are required' 
            });
        }

        const auction = await Auction.findById(req.params.id);

        if (!auction) {
            return res.status(404).json({ 
                success: false,
                message: 'Auction not found' 
            });
        }

        if (auction.isClosed) {
            return res.status(400).json({ 
                success: false,
                message: 'Auction is closed' 
            });
        }

        const bidAmount = parseFloat(amount);
        const currentBid = parseFloat(auction.currentBid);

        if (isNaN(bidAmount) || bidAmount <= currentBid) {
            return res.status(400).json({ 
                success: false,
                message: 'Bid must be higher than current bid' 
            });
        }

        auction.currentBid = bidAmount;
        auction.highestBidder = username;

        // Check if auction has ended
        const now = new Date();
        if (new Date(auction.closingTime) <= now) {
            auction.isClosed = true;
            auction.winner = username;
        }

        await auction.save();
        
        res.json({ 
            success: true,
            message: 'Bid placed successfully', 
            auction: {
                currentBid: auction.currentBid,
                highestBidder: auction.highestBidder,
                isClosed: auction.isClosed,
                winner: auction.winner
            }
        });
    } catch (error) {
        console.error('Bid error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message || 'Error placing bid' 
        });
    }
});

// Delete auction
router.delete('/auction/:id', async (req, res) => {
    try {
        const auction = await Auction.findById(req.params.id);
        
        if (!auction) {
            return res.status(404).json({ 
                success: false, 
                message: 'Auction not found' 
            });
        }

        await Auction.findByIdAndDelete(req.params.id);
        
        res.json({ 
            success: true, 
            message: 'Auction deleted successfully' 
        });
    } catch (error) {
        console.error('Delete auction error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error deleting auction' 
        });
    }
});

module.exports = router; 