# React Native MFA Application

A secure Multi-Factor Authentication (MFA) application built with React Native (Expo) frontend and Node.js backend for testing and demonstration purposes, featuring a beautiful green-themed UI and comprehensive 2FA implementation.

## 🤖 AI Contribution

### UI Development
AI was used to
- Creating the beautiful green gradient theme throughout the app
- Implementing React Context for global authentication state management
- Designing responsive UI components with NativeWind/Tailwind CSS

### API Development  
AI was used to generate backend boilerplate like Docker files, MongoDB connections, and email service. It was also used to create models and other boilerplate code including:
- Express server setup
- MongoDB schema design and database connections
- Docker containerization and compose files
- Email service integration with nodemailer

## 🚀 Features

### Frontend (React Native/Expo)
- **🎨 Beautiful Green Theme**: Consistent emerald color scheme throughout the app
- **📱 Native Navigation**: Stack navigation with smooth animations
- **🔐 Multi-Screen Auth Flow**: Login → Email Verification → Secure Dashboard
- **⚡ Real-time Validation**: Form validation with immediate feedback
- **🎯 Responsive Design**: Works seamlessly on iOS and Android
- **💾 Secure Storage**: JWT tokens stored securely using Expo SecureStore
- **📧 Email Verification**: 6-digit codes with countdown timer and resend functionality

### Backend (Node.js/Express)
- **🛡️ Multi-Factor Authentication**: Username/Password + Email verification
- **🔒 Secure Password Storage**: bcryptjs with 12 salt rounds
- **🎫 JWT Token Management**: Separate tokens for MFA flow and authenticated sessions
- **📧 HTML Email Templates**: Beautiful verification code emails
- **🗄️ MongoDB Integration**: Secure user data storage
- **🔐 Security Headers**: Helmet.js for enhanced security
- **🚦 Input Validation**: Comprehensive request validation

### Security Features
- **Two-Factor Authentication**: Knowledge (password) + Possession (email)
- **Token Expiration**: MFA tokens expire in 10 minutes, verification codes in 5 minutes
- **Secure Headers**: CORS, Helmet.js protection
- **Password Hashing**: Industry-standard bcrypt with salt
- **Input Sanitization**: All inputs validated and sanitized

## 📁 Project Structure

```
React-Native-MFA-Application/
├── MFA-API/                    # Backend API
│   ├── models/                 # MongoDB models
│   │   └── User.js            # User schema with MFA fields
│   ├── routes/                # API routes
│   │   └── auth.js            # Authentication endpoints
│   ├── services/              # Business logic
│   │   └── emailService.js    # Email sending service
│   ├── middleware/            # Express middleware
│   │   └── auth.js            # JWT authentication middleware
│   ├── utils/                 # Utility functions
│   │   └── jwt.js             # JWT token utilities
│   ├── server.js              # Express server setup
│   ├── package.json           # Backend dependencies
│   ├── Dockerfile             # Docker configuration
│   
│
└── MFA-UI/                    # React Native Frontend
    ├── context/               # React Context
    │   └── AuthContext.tsx    # Authentication state management
    ├── screens/               # App screens
    │   ├── LoginScreen.tsx    # Login with username/password
    │   ├── RegisterScreen.tsx # User registration
    │   ├── EmailVerificationScreen.tsx # 2FA email verification
    │   └── HomeScreen.tsx     # Secure dashboard
    ├── services/              # API services
    │   └── api.ts             # API calls and token management
    ├── App.tsx                # Main app with navigation
    ├── package.json           # Frontend dependencies
    └── global.css             # Global styles
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher) OR Docker & Docker Compose
- Expo CLI (`npm install -g @expo/cli`)
- Gmail account with App Password (for email sending)

### Option 1: Docker Setup (Recommended) 🐳

The easiest way to get started is using Docker Compose, which will set up MongoDB and the API automatically.

1. **Install Docker**
   - Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

2. **Edit Email Configuration**
   Edit `docker-compose.yml` and update the email environment variables:
   ```yaml
   EMAIL_USER: your-email@gmail.com
   EMAIL_PASS: your-gmail-app-password
   EMAIL_FROM: your-email@gmail.com
   ```

3. **Start Services**
   ```bash
   docker compose up -d --build
   ```

4. **Setup Frontend**
   ```bash
   cd MFA-UI
   npm install
   npx expo start
   ```

**Services:**
- 📱 **MFA API**: http://localhost:3000
- 🗄️ **MongoDB**: localhost:27017

**Docker Commands:**
```bash
# View logs
docker compose logs -f

# Stop services  
docker compose down

# Restart services
docker compose restart
```

### Option 2: Manual Setup

If you prefer to set up services manually:

### Option 2: Manual Setup

If you prefer to set up services manually:

#### Backend Setup

1. **Navigate to API directory**
   ```bash
   cd MFA-API
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mfa-app
   JWT_SECRET=your-test-jwt-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

   The API will be available at `http://localhost:3000`

#### Frontend Setup

1. **Navigate to UI directory**
   ```bash
   cd MFA-UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the Expo development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press 'i' for iOS simulator
   - Press 'a' for Android emulator

## 🔐 Authentication Flow

### 1. Registration
- User creates account with username, email, and password
- Password is hashed with bcrypt (12 salt rounds)
- Account created in "unverified" state

### 2. Login Process
- **Step 1**: User enters username/password (First Factor)
- **Step 2**: System sends 6-digit code to email (Second Factor)
- **Step 3**: User enters verification code
- **Step 4**: Access granted with JWT token

### 3. Security Features
- Verification codes expire in 5 minutes
- MFA tokens expire in 10 minutes  
- Secure token storage using Expo SecureStore

## 🎨 UI/UX Features

### Green Theme Design
- **Primary Colors**: Emerald green gradients (#10b981, #059669, #047857)
- **Consistent Styling**: All components follow the green color scheme
- **Accessibility**: High contrast ratios and readable fonts
- **Responsive**: Adapts to different screen sizes

### User Experience
- **Smooth Animations**: Page transitions and loading states
- **Real-time Feedback**: Form validation and error messages
- **Loading States**: Proper loading indicators for all async operations
- **Error Handling**: Graceful error messages and recovery options

## 🔒 Security Considerations

### Current Implementation
- ✅ Password hashing with bcrypt
- ✅ JWT token management
- ✅ Email-based 2FA
- ✅ Input validation
- ✅ Secure token storage

### Future Enhancements (Extensible Design)
- 📱 SMS verification
- 🔐 TOTP (Google Authenticator)
- 👆 Biometric authentication
- 📍 Location-based verification
- 🔑 Hardware security keys
- 📲 Push notifications

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - First factor authentication  
- `POST /api/auth/verify-email` - Second factor verification
- `POST /api/auth/resend-code` - Resend verification code

## 🛠️ Prerequisites

Before running the application, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Expo CLI** installed globally: `npm install -g @expo/cli`
- **Docker & Docker Compose** (for containerized setup)
- **MongoDB** (if running manually)
- **Gmail account** with App Password enabled for email functionality

## 🚀 Quick Start

### Option 1: Docker Setup (Recommended) 🐳

The fastest way to get the application running:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd React-Native-MFA-Application
   ```

2. **Configure email settings**
   
   Create a `.env` file in the root directory or edit `docker-compose.yml`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

3. **Start backend services**
   ```bash
   docker compose up -d --build
   ```

4. **Start the React Native app**
   ```bash
   cd MFA-UI
   npm install
   npx expo start
   ```

5. **Open the app**
   - Scan the QR code with Expo Go app on your phone
   - Press `i` for iOS simulator or `a` for Android emulator

**🎉 That's it! Your MFA app is now running!**

### Option 2: Manual Setup

If you prefer to run services manually:

#### Backend Setup

1. **Install MongoDB**
   - Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
   - Start MongoDB service

2. **Setup the API**
   ```bash
   cd MFA-API
   npm install
   cp .env.example .env
   ```

3. **Configure environment variables**
   Edit the `.env` file:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/mfa-app
   JWT_SECRET=your-test-jwt-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

4. **Start the backend**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Standard mode  
   npm start
   ```
   API will be available at `http://localhost:3000`

#### Frontend Setup

1. **Setup the React Native app**
   ```bash
   cd MFA-UI
   npm install
   npx expo start
   ```

2. **Run on device/simulator**
   - Scan QR code with Expo Go app (iOS/Android)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

### Testing Emails
In development mode, the app uses Ethereal Email for testing:
- Real emails are sent to your configured Gmail
- Preview URLs are logged in the console for testing accounts

## 🖥️ Available Scripts

### Backend (MFA-API/)
```bash
npm start      # Start standard server
npm run dev    # Start development server with nodemon
```

### Frontend (MFA-UI/)
```bash
npm start      # Start Expo development server
npm run android # Run on Android emulator
npm run ios    # Run on iOS simulator  
npm run web    # Run in web browser
```

### Docker Commands
```bash
# Start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Stop services
docker compose down

# Restart services
docker compose restart

# Remove all containers and volumes
docker compose down -v
```

## 🧪 Testing the Application

### Step-by-Step Testing Guide

1. **Start the application** using either Docker or manual setup
2. **Create a test account**:
   - Open the app and tap "Create Account"
   - Fill in username, email (use a real email), and password
   - Tap "Create Account"

3. **Complete the login flow**:
   - Enter your username and password
   - Tap "Sign In"
   - Check your email for a 6-digit verification code
   - Enter the code in the app
   - Access the secure dashboard

### Test Scenarios
- ✅ **Registration**: Create multiple accounts with different emails
- ✅ **Login Flow**: Test username/password → email verification → dashboard
- ✅ **Code Expiration**: Wait 5 minutes to test code expiration  
- ✅ **Resend Functionality**: Use the "Resend Code" button
- ✅ **Error Handling**: Test with wrong passwords, invalid codes
- ✅ **Logout**: Test logout and re-authentication
- ✅ **Token Persistence**: Close and reopen app to test token storage

### Troubleshooting

**Can't receive emails?**
- Check spam/junk folder
- Ensure Gmail App Password is correct
- Verify EMAIL_USER and EMAIL_FROM are set to the same Gmail address

**App won't connect to API?**
- Ensure backend is running on port 3000
- Check API URL in `MFA-UI/services/api.ts`
- For Android emulator, API uses `10.0.2.2:3000`
- For iOS simulator, API uses `localhost:3000`

**MongoDB connection issues?**
- Ensure MongoDB is running
- Check MongoDB URI in environment variables
- For Docker: `mongodb://mongodb:27017/mfa-app`
- For local: `mongodb://localhost:27017/mfa-app`

## 🔐 Security Features Implemented

### Authentication Security
- ✅ **Password Hashing**: bcryptjs with 12 salt rounds
- ✅ **JWT Tokens**: Separate tokens for MFA flow and authenticated sessions
- ✅ **Token Expiration**: MFA tokens (10 min), verification codes (5 min)
- ✅ **Secure Storage**: Expo SecureStore for token persistence

### API Security
- ✅ **CORS Configuration**: Restricted to specific origins
- ✅ **Helmet.js**: Security headers (XSS, CSRF protection)
- ✅ **Input Validation**: All requests validated and sanitized
- ✅ **Error Handling**: No sensitive data leaked in error messages

### Email Security
- ✅ **HTML Templates**: Professional, secure email formatting
- ✅ **Code Generation**: 6-digit cryptographically secure codes
- ✅ **Expiration**: Time-limited verification codes

## 🎯 Future Enhancements

### Security Considerations
- Use HTTPS in production
- Set strong JWT secrets (32+ characters)
- Use production MongoDB with authentication
- Configure proper CORS origins
- Enable MongoDB connection encryption
- Set up monitoring and logging
- Regular security audits and updates

### Scaling Considerations
- Database indexing for user lookups
- Redis for session storage at scale
- Load balancing for multiple API instances
- CDN for static assets

## 🎯 Future Enhancements

The application is designed with extensibility in mind:

### Additional MFA Methods
- 📱 **SMS Verification**: Text message codes
- 🔐 **TOTP Integration**: Google Authenticator, Authy
- 👆 **Biometric Auth**: Fingerprint, Face ID
- 📍 **Location-based**: Geofencing verification
- 🔑 **Hardware Keys**: YubiKey, FIDO2 support
- 📲 **Push Notifications**: Silent push authentication


**🔐 Built with security first - Perfect for testing and learning MFA concepts!**

*This application demonstrates modern multi-factor authentication patterns for educational and testing purposes.* 
