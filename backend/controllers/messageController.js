import messageModel from "../model/Message.js";

export const getHistoryMessage = async (req, res) => {
    try {
        const { user1, user2} = req.params;

        const messages = await messageModel.find({
            $or: [
                {senderId: user1, receiverId: user2},
                {senderId: user2, receiverId: user1},
                {senderId: 'ai-bot', receiverId: user1}
            ]
        }).sort({ timestamp: 1});

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({error: "Failed get data chat"});
    }
}

export const deleteMsgs = async (req, res) => {
    try {
        const { user1, user2} = req.params;

        await messageModel.deleteMany({
            $or: [
                {senderId: user1, receiverId: user2},
                {senderId: user2, receiverId: user1}
            ]
        });

        res.status(200).json({message: "Successfully delete data message"});
    } catch (error) {
        res.status(500).json({error: "Failed delete data message"});
    }
};