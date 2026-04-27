const mongoose = require('mongoose');

const knowledgeSchema = new mongoose.Schema({
  text: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    default: 'General' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Knowledge', knowledgeSchema);