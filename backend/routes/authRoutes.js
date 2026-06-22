import express from 'express'
import { verifyEmail ,register, login, logout, verifyOtp,googleLogin, sendResetOtp, resetPassword, users } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { use } from 'react';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/googleLogin', googleLogin);
authRouter.post('/send-otp', sendResetOtp);
authRouter.post('/reset', resetPassword );
authRouter.post('/verify-otp', verifyOtp );
authRouter.get('/users', users);
authRouter.get('/verify-email/:token', verifyEmail);

export default authRouter;