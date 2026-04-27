require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const axios = require('axios'); 

connectDB();
const app = express();

// MIDDLEWARES
app.use(express.json());
// CRITICAL: This allows Twilio to talk to your code!
app.use(express.urlencoded({ extended: true })); 
app.use(cors());

// API ROUTES
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/twilio', require('./routes/twilioRoutes'));

app.get('/', (req, res) => {
  res.send('MamaCare AI Healthcare API is running...');
});

// Chat endpoint for Website
app.post('/api/chat', async (req, res) => {
    const { message, language } = req.body;
    try {
        const aiRes = await axios.post('http://127.0.0.1:8000/chat', { 
            query: message,
            language: language || 'en'
        });
        res.json({ response: aiRes.data.response });
    } catch (error) {
        res.status(500).json({ response: "AI Engine is offline." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Node.js Server live on Port ${PORT}`);
});