 
import authService from "../services/auth.service.js";
import { sendVerificationEmail } from "../utils/emailService.js";

 
const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email address required." });
    }

 
    const verificationCode = await authService.createVerificationCode(email);

 
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ 
      success: true, 
      message: "The verification code has been sent to your email address." 
    });

  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ message: error.message });
  }
};

 
const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: "Email and code required." });
    }

    await authService.verifyCode(email, code);

    res.status(200).json({ 
      success: true, 
      message: "Email verified successfully." 
    });

  } catch (error) {
    console.error("Code validation error:", error);
    res.status(400).json({ message: error.message });
  }
};


const register = async (req, res) => {
  try {
    const { email } = req.body;

     
    if (!authService.isEmailVerified(email)) {
      return res.status(403).json({ 
        message: "Please verify your email address first." 
      });
    }

    const result = await authService.registerUserAndCustomer(req.body);

    res.status(201).json({
      message: "Registration completed successfully.",
      token: result.user.token,
      customer: result.customer,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: "user"
      }
    });

  } catch (error) {
    console.error("Recording error:", error);
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      token: user.token, 
      customer: user.Customer,
      user: { 
        id: user.id, 
        email: user.email, 
        role_id: user.role_id, 
        role: user.role
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    res.status(401).json({ message: error.message });
  }
};

export default { 
  register, 
  login,
  sendVerificationCode,
  verifyCode
};