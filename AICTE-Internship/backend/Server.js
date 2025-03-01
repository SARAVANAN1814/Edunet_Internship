require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection with specific host
mongoose.connect('mongodb://127.0.0.1:27017/aicteDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to local MongoDB');
    console.log('Database: aicteDB');
})
.catch((error) => {
    console.error('MongoDB connection error:', error.message);
    console.error('Please ensure:');
    console.error('1. MongoDB is installed');
    console.error('2. MongoDB service is running');
    console.error('3. MongoDB Compass is open');
    process.exit(1);
});

// Routes
app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
