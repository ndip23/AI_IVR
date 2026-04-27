const axios = require('axios');
const twilio = require('twilio');
const { MessagingResponse } = twilio.twiml;
const { VoiceResponse } = twilio.twiml;

// --- 1. WHATSAPP HANDLER ---
exports.handleWhatsApp = async (req, res) => {
    // Log what is coming from WhatsApp
    console.log("--- New WhatsApp Message ---");
    console.log("From:", req.body.From);
    console.log("Message:", req.body.Body);

    const userMsg = req.body.Body;
    const twiml = new MessagingResponse();

    try {
        // Forward to Python AI
        const aiRes = await axios.post('http://127.0.0.1:8000/chat', { 
            query: userMsg,
            language: 'pg' // Test in Pidgin for Cameroon context
        });

        console.log("AI Answered:", aiRes.data.response);

        // Twilio expects a <Response><Message>... format
        twiml.message(aiRes.data.response);
        
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    } catch (error) {
        console.error("WhatsApp Bridge Error:", error.message);
        twiml.message("MamaCare AI is briefly offline. Mami, abeg try again small time.");
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    }
};

// --- 2. IVR / VOICE CALL HANDLER ---
exports.handleVoiceCall = async (req, res) => {
    const twiml = new VoiceResponse();
    console.log("--- Incoming Voice Call ---");

    const gather = twiml.gather({
        input: 'speech',
        action: '/api/twilio/voice-respond',
        timeout: 5,
        language: 'en-US',
    });

    gather.say("Welcome to MamaCare health support. Please describe your symptoms after the beep.");
    res.type('text/xml').send(twiml.toString());
};

// --- 3. IVR RESPONSE PROCESSOR ---
exports.processVoiceResponse = async (req, res) => {
    const userSpeech = req.body.SpeechResult;
    console.log("User Spoke:", userSpeech);
    const twiml = new VoiceResponse();

    try {
        const aiRes = await axios.post('http://127.0.0.1:8000/chat', { query: userSpeech });
        twiml.say(aiRes.data.response);
        twiml.pause({ length: 1 });
        twiml.say("If this is an emergency, go to the hospital. Goodbye.");
        twiml.hangup();
    } catch (error) {
        twiml.say("I am having trouble connecting. Try again later.");
    }
    res.type('text/xml').send(twiml.toString());
};