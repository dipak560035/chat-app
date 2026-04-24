const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
