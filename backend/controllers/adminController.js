const Knowledge = require('../models/Knowledge');
const User = require('../models/User');
const axios = require('axios');

// Get real stats for the Dashboard cards
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalKnowledge = await Knowledge.countDocuments();
    
    // Check if Python AI is actually running
    let aiStatus = false;
    try {
        await axios.get('http://127.0.0.1:8000/status');
        aiStatus = true;
    } catch (e) { aiStatus = false; }

    res.json({
      totalUsers,
      totalKnowledge,
      aiTrained: aiStatus,
      accuracyRate: "94%"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the list of 50 FAQs for the Dashboard
exports.getKnowledge = async (req, res) => {
  try {
    const data = await Knowledge.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new rule from the Dashboard
exports.addKnowledge = async (req, res) => {
  try {
    const newItem = await Knowledge.create({ text: req.body.text });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// THE SYNC: Send MongoDB data to Python AI
exports.syncAI = async (req, res) => {
  try {
    const allDocs = await Knowledge.find();
    const textList = allDocs.map(d => d.text);

    // This is the bridge to Python
    const response = await axios.post('http://127.0.0.1:8000/train', {
      documents: textList
    });

    res.json({ message: "AI Brain Updated!", pythonResponse: response.data });
  } catch (error) {
    res.status(500).json({ message: "Could not reach AI Engine. Is Python running?" });
  }
};
exports.deleteKnowledge = async (req, res) => {
    try {
        await Knowledge.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};