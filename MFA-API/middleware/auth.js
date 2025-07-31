const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
  }

  try {
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
};

// Middleware to verify MFA pending token
const authenticateMFAToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'MFA token required' 
    });
  }

  const decoded = verifyToken(token);
  if (!decoded || decoded.type !== 'mfa-pending') {
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid or expired MFA token' 
    });
  }

  req.mfaUser = decoded;
  next();
};

module.exports = {
  authenticateToken,
  authenticateMFAToken
};
