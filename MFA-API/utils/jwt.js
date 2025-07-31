const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Generate temporary MFA token (used between first factor and second factor)
const generateMFAToken = (userId, username) => {
  return jwt.sign(
    { userId, username, type: 'mfa-pending' }, 
    process.env.JWT_SECRET, 
    { expiresIn: '10m' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  generateMFAToken,
  verifyToken
};
