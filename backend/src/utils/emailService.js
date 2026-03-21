import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,      
    pass: process.env.EMAIL_APP_PASSWORD  
  }
});

/**
 * Send verification code
 * @param {string} to - Recipient email address
 * @param {string} code - 6-digit verification code
 */
export const sendVerificationEmail = async (to, code) => {
  try {
    const mailOptions = {
      from: `"E-Commerce" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "Account Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333; text-align: center;">Account Verification</h2>
          <p style="font-size: 16px;">Hello,</p>
          <p style="font-size: 16px;">Use the following code to verify your account:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #4CAF50; font-size: 36px; letter-spacing: 5px; margin: 0;">${code}</h1>
          </div>
          <p style="font-size: 14px; color: #666;">This code is valid for <strong>10 minutes</strong>.
          <p style="font-size: 14px; color: #666;">If you did not perform this action, disregard this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© 2024 E-Commerce. All rights reserved.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("The verification email could not be sent.");
  }
};