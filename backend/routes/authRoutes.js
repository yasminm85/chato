import express from 'express'
import { verifyEmail ,register, login, logout, verifyOtp,googleLogin, sendResetOtp, resetPassword, users, updateProfile, getDataById, blockUser } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { use } from 'react';
import rateLimit from 'express-rate-limit';

const authRouter = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 15, 
  message: {
    success: false,
    message: 'Too many attempts from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

authRouter.post('/register', authLimiter,register);
authRouter.post('/login', authLimiter,login);
authRouter.post('/logout', logout);
authRouter.post('/googleLogin', googleLogin);
authRouter.post('/send-otp', sendResetOtp);
authRouter.post('/reset', resetPassword );
authRouter.post('/verify-otp', verifyOtp );
authRouter.get('/users', users);
authRouter.get('/verify-email/:token', verifyEmail);
authRouter.put('/update/:id', updateProfile);
authRouter.get('/getUser/:id', getDataById);
authRouter.post('/block', authMiddleware, blockUser);

export default authRouter;