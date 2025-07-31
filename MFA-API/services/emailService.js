const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
      this.setupTestAccount();
  }

  async setupTestAccount() {
    try {
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } catch (error) {
      console.error('Failed to create test account:', error);
    }
  }

  async sendVerificationCode(email, code, username) {
    const mailOptions = {
      from: 'noreply@mfaapp.com',
      to: email,
      subject: 'MFA Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 MFA Verification</h1>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin-top: 0;">Hello ${username}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              You're attempting to sign in to your account. Please use the verification code below to complete your login:
            </p>
            <div style="background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 8px;">${code}</span>
            </div>
            <p style="color: #666; font-size: 14px;">
              This code will expire in <strong>5 minutes</strong> for security reasons.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      // Log the preview URL for testing
      console.log('📧 Email sent! Preview URL:', nodemailer.getTestMessageUrl(info));
      
      return { success: true };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
