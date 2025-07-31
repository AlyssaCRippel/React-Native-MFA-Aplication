const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  },
  // Future MFA methods can be added here
  mfaMethods: {
    email: {
      enabled: { type: Boolean, default: true }
    },
    sms: {
      enabled: { type: Boolean, default: false },
      phoneNumber: { type: String, default: null }
    },
    biometric: {
      enabled: { type: Boolean, default: false }
    },
    location: {
      enabled: { type: Boolean, default: false },
      allowedLocations: [{ type: String }]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  this.emailVerificationToken = token;
  this.emailVerificationExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  return token;
};

// Verify email token
userSchema.methods.verifyEmailToken = function(token) {
  return this.emailVerificationToken === token && 
         this.emailVerificationExpires > new Date();
};

module.exports = mongoose.model('User', userSchema);
