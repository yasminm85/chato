import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../model/User.js';
import axios from 'axios';
import transporter from '../config/nodemailer.js';
import crypto from 'crypto';
import sendVerificationEmail from '../config/emailVerif.js';
import sendOtp from '../config/nodemailer.js';

export const users = async (req, res) => {
  try {
    const getUser = await userModel.find().select('-password -email -verificationToken -__v -blockedUser');
    res.status(200).json({ message: 'Get all user', getUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users' });
  }
};

export const register = async (req, res) => {
  try {
    const { email, username, password, age, gender, country } = req.body;

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: 'Users with this email is exist please try another one',
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must 8 character and include a mix of uppercase, lowercase, and numeric characters',
      });
    }

    if(!email || !username) {
      return res.status(400).json({message: 'Please input email or username'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new userModel({
      email,
      username,
      password: hashedPassword,
      age,
      gender,
      country,
      verificationToken,
    });

    await newUser.save();
    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: 'User registered sucessfully' });
  } catch (error) {
    console.error('EXACT REGISTRATION ERROR:', error);
    res
      .status(500)
      .json({ message: 'Error registering user', details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please input email and password' });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user.isVerified) {
      res
        .status(401)
        .json({ error: 'Email not verified, please check your email!' });
    }
    if (!user) {
      res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: 'Password not match' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Login Failed' });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.status(200).json({ message: 'Logout Successfuly' });
  } catch (error) {
    return res.status(500).json({ message: 'logout failed' });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({ message: 'Access token is not exist' });
    }

    const googleResponse = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );

    const googleUser = googleResponse.data;

    let user = await userModel.findOne({ email: googleUser.email });

    if (!user) {
      user = new userModel({
        username: googleUser.name,
        email: googleUser.email,
        password:
          Math.random().toString(36).slice(-10) +
          Math.random().toString(36).slice(-10),
      });
      await user.save();
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
      },
    );

    res.status(200).json({
      message: 'Login Google Successfully',
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        gender: user.gender,
      },
    });
  } catch (error) {
    console.error('Error Google Login Backend:', error.message);
    res.status(500).json({ message: 'Failed Authentication using google' });
  }
};

export const getDataById = async (req, res) => {
  const { id } = req.params;

  try {
    const findUser = await userModel.findById(id);

    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user: findUser });
  } catch (error) {
    console.error('Failed to get Data By ID', error);
    res.status(500).json({ message: 'Error get data' });
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;

  const { username, age, gender, country } = req.body;

  try {
    const update = await userModel.findByIdAndUpdate(
      id,
      {
        username,
        age,
        gender,
        country,
      },
      { new: true },
    );

    if (!update) {
      return res.status(404).json({ message: 'User tidak ditemukan!' });
    }
    res.status(200).json({ message: 'Update Successfully', user: update });
  } catch (error) {
    console.error('Error cant update', error);
    res.status(500).json({ message: 'Failed to update data' });
  }
};

export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: 'Email is required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    await sendOtp(email, otp);

    return res
      .status(200)
      .json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!otp || !email) {
    return res.status(400).json({
      success: false,
      message: 'OTP and Email are required',
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP Expired' });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: 'Email, OTP, and new password are required',
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP Expired' });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must 8 character, with capital, lower, and symbol.',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: 'Passowrd has been reset successfully',
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await userModel.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Token is not valid' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email successfully verified' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verification Email' });
  }
};

export const blockUser = async (req, res) => {
  try {
    const myUserId = req.user.id || req.user._id;
    const { targetedId } = req.body;

    const myUser = await userModel.findById(myUserId).lean();
    if (!myUser) {
      return res
        .status(404)
        .json({ success: false, message: 'User tidak ditemukan' });
    }

    const isAlreadyBlocked = (myUser.blockedUser || [])
      .map((id) => id.toString())
      .includes(targetedId.toString());

    if (isAlreadyBlocked) {
  const updated = await userModel.findByIdAndUpdate(
    myUserId,
    { $pull: { blockedUser: targetedId } },
    { returnDocument: 'after' } 
  );
  return res.status(200).json({
    success: true,
    message: 'User unblocked successfully',
    blockedUser: updated.blockedUser, 
  });
} else {
  const updated = await userModel.findByIdAndUpdate(
    myUserId,
    { $addToSet: { blockedUser: targetedId } },
    { returnDocument: 'after' } 
  );
  return res.status(200).json({
    success: true,
    message: 'User blocked successfully',
    blockedUser: updated.blockedUser, 
  });
}
  } catch (error) {
    console.error('ERROR DI BACKEND CONTROLLER:', error);
    return res
      .status(500)
      .json({
        success: false,
        error: 'Server error gagal memproses block/unblock',
      });
  }
};
