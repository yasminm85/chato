import { Server } from "socket.io";
import { analyzeGrammar } from "../utils/aiService.js";
import messageModel from "../model/Message.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    const onlineUsers = {};

    io.on('connection', (socket) => {
        console.log(`User connected with Socket ID: ${socket.id}`);

        socket.on('addNewUser', (userId) => {
            if(userId) {
                onlineUsers[socket.id] = userId;
                
                
                socket.join(userId); 
                
                console.log('List online', onlineUsers);
                io.emit('getOnlineUsers', Object.values(onlineUsers));
            }
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
            delete onlineUsers[socket.id];
            io.emit('getOnlineUsers', Object.values(onlineUsers));
        });

        socket.on('sendMessage', async (data) => {
            try {
                const newMessage = new messageModel({
                    senderId: data.senderId,
                    receiverId: data.receiverId,
                    text: data.text,
                });
                await newMessage.save();

                io.to(data.receiverId).emit('getMessage', data);

                const grammarCheck = await analyzeGrammar(data.text);

                if(grammarCheck) {
                    const aiMessage = new messageModel({
                        senderId: 'ai-bot',
                        receiverId: data.senderId,
                        text: 'AI Grammar Check',
                        aiText: grammarCheck.aiText, 
                        rule: grammarCheck.rule,
                        isAi: true
                    });

                    await aiMessage.save();

                    io.to(data.senderId).emit('getMessage', {
                        senderId: 'ai-bot',
                        text: 'AI Grammar Check',
                        aiText: grammarCheck.aiText,
                        rule: grammarCheck.rule,
                        isAi: true
                    });
                }
            } catch (error) {
                console.error("Failed To Save Message", error);
            }
        });

        socket.on('typing', (data) => {
            io.to(data.receiverId).emit('typing', data.senderId);
        });

        socket.on('stopTyping', (data) => {
            io.to(data.receiverId).emit('stopTyping', data.senderId);
        });
    });

    return io;
}

export const getIo = () => {
    if(!io) throw new Error("Socket.io hasn't inisialize");
    return io;
}