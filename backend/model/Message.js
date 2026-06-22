import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    aiText: {
        type: String,
        default: null
    },
    rule: {
        type: String,
        default: null
    },
    isAi: {
        type: String,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const messageModel = mongoose.models.message || mongoose.model('messages', messageSchema);

export default messageModel;