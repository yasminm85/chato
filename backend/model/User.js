import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        default: null
    },
    gender: {
        type: String,
        enum: ['male', 'female', null],
        default: null
    },
    country: {
        type: String,
        default: "ID"
    },
    googleId: {
        type: String,
        default: null
    },
    picture: {
        type: String,
        default: null
    },
    resetOtp: {
        type: String,
        default: ''
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    }
    
}, {timestamps: true});

const userModel = mongoose.models.user || mongoose.model('users', userSchema);

export default userModel;