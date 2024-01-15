// routes/users.js
import express from 'express';
import User from '../models/auth.js';
import { login, signup, forgotPassword, resetPassword } from '../controllers/auth.js';
import { getAllUsers, updateProfile } from '../controllers/users.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Route to fetch login history
router.get('/:id/login-history', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming user.loginHistory is an array of login history objects
    res.status(200).json(user.loginHistory);
  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// New routes for forgot password and reset password
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);

// Other routes for login, signup, getAllUsers, and updateProfile
router.post('/signup', signup);
router.post('/login', login);
router.get('/getAllUsers', getAllUsers);
router.patch('/update/:id', auth, updateProfile);

export default router;
