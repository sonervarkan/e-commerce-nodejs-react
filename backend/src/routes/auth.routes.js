 
import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/send-verification', authController.sendVerificationCode);
router.post('/verify-code', authController.verifyCode);

export default router;