const User = require('../models/User');
const Message = require('../models/Message');

//     Get all users
// route,   GET /api/users
// access,  Private
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Get user profile
// route,   GET /api/users/profile
// access,  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Update user profile
// route,   PUT /api/users/profile
// access,  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Delete user
// route,   DELETE /api/users/:id
// access,  Private
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//     Get stats (total users and total messages)
// route,   GET /api/users/stats
// access,  Public (or Private)
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMessages = await Message.countDocuments();
    res.json({ totalUsers, totalMessages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getStats
};
