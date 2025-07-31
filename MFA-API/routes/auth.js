const express = require('express');
const User = require('../models/User');
const { generateToken, generateMFAToken } = require('../utils/jwt');
const { authenticateMFAToken } = require('../middleware/auth');
const emailService = require('../services/emailService');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create new user
    const user = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Step 1: Initial login (username/password)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [
        { username: username.trim() },
        { email: username.toLowerCase().trim() }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate email verification code
    const verificationCode = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    const emailResult = await emailService.sendVerificationCode(
      user.email, 
      verificationCode, 
      user.username
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    // Generate temporary MFA token
    const mfaToken = generateMFAToken(user._id, user.username);

    res.json({
      success: true,
      message: 'First factor authenticated. Verification code sent to email.',
      data: {
        mfaToken,
        email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Masked email
        requiresMFA: true
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Step 2: Verify email code (second factor)
router.post('/verify-email', authenticateMFAToken, async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Verification code is required'
      });
    }

    const user = await User.findById(req.mfaUser.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify the code
    if (!user.verifyEmailToken(code.trim())) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired verification code'
      });
    }

    // Clear verification token and mark email as verified
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    user.isEmailVerified = true;
    user.lastLogin = new Date();
    await user.save();

    // Generate final access token
    const accessToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Authentication successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isEmailVerified: user.isEmailVerified
        }
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
});

// Resend verification code
router.post('/resend-code', authenticateMFAToken, async (req, res) => {
  try {
    const user = await User.findById(req.mfaUser.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new verification code
    const verificationCode = user.generateEmailVerificationToken();
    await user.save();

    // Send verification email
    const emailResult = await emailService.sendVerificationCode(
      user.email, 
      verificationCode, 
      user.username
    );

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.json({
      success: true,
      message: 'New verification code sent to email'
    });

  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resending code'
    });
  }
});

module.exports = router;
