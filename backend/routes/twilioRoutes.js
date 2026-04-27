const express = require('express');
const router = express.Router();
const { handleWhatsApp, handleVoiceCall, processVoiceResponse } = require('../controllers/twilioController');

// Twilio calls these endpoints
router.post('/whatsapp', handleWhatsApp);
router.post('/voice', handleVoiceCall);
router.post('/voice-respond', processVoiceResponse);

module.exports = router;