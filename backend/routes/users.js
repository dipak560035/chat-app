const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getStats
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', getStats);
router.route('/')
  .get(protect, getUsers);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route('/:id')
  .delete(protect, deleteUser);

module.exports = router;
