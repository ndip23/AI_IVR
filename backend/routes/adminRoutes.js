const express = require('express');
const router = express.Router();
const { getStats, getKnowledge, addKnowledge, deleteKnowledge, syncAI } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Define your routes
router.get('/stats', protect, isAdmin, getStats);
router.get('/knowledge', protect, isAdmin, getKnowledge);
router.post('/knowledge', protect, isAdmin, addKnowledge);
router.delete('/knowledge/:id', protect, isAdmin, deleteKnowledge);
router.post('/sync', protect, isAdmin, syncAI);

// THIS LINE IS THE FIX:
module.exports = router;