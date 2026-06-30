import { Server } from 'socket.io';
import { analyzeGrammar } from '../utils/aiService.js';
import messageModel from '../model/Message.js';
import userModel from '../model/User.js';
import jwt from 'jsonwebtoken';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: 'https://chato.sbs',
      methods: ['GET', 'POST'],
    },
  });

  const onlineUsers = {};

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token || socket.handshake.headers?.token;

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;

      next();
    } catch (err) {
      return next(new Error('Authentication error: Token invalid/expired'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('addNewUser', (userId) => {
      if (userId) {
        onlineUsers[socket.id] = userId;

        socket.join(userId);

        io.emit('getOnlineUsers', Object.values(onlineUsers));
      }
    });

    socket.on('disconnect', () => {
      delete onlineUsers[socket.id];
      io.emit('getOnlineUsers', Object.values(onlineUsers));
    });

    socket.on('sendMessage', async (data) => {
      try {
        const newMessage = new messageModel({
          senderId: socket.user.id,
          receiverId: data.receiverId,
          text: data.text,
        });
        await newMessage.save();

        io.to(data.receiverId).emit('getMessage', data);

        const senderUser = await userModel.findById(data.senderId);

        if (senderUser) {
          const todayDate = new Date().toISOString().split('T')[0];

          if (senderUser.lastAiUsage !== todayDate) {
            senderUser.aiUsageCount = 0;
            senderUser.lastAiUsage = todayDate;
          }
        }

        const Daily_LIMIT = 5;

        if (senderUser.aiUsageCount <= Daily_LIMIT) {
          const grammarCheck = await analyzeGrammar(data.text);

          senderUser.aiUsageCount += 1;
          await senderUser.save();

          if (grammarCheck) {
            const aiMessage = new messageModel({
              senderId: 'ai-bot',
              receiverId: data.senderId,
              text: 'AI Grammar Check',
              aiText: grammarCheck.aiText,
              rule: grammarCheck.rule,
              isAi: true,
            });

            await aiMessage.save();

            io.to(data.senderId).emit('getMessage', {
              senderId: 'ai-bot',
              receiverId: data.senderId,
              text: 'AI Grammar Check',
              aiText: grammarCheck.aiText,
              rule: grammarCheck.rule,
              isAi: true,
            });
          }
        } else {
          io.to(data.senderId).emit('getMessage', {
            senderId: 'ai-bot',
            receiverId: data.senderId,
            text: 'Limit Reached',
            aiText: 'Your limit has run out, try out tommorow',
            rule: 'Daily Quota Exceeded',
            isAi: true,
          });
        }
      } catch (error) {
        console.error('Failed To Save Message', error);
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
};

export const getIo = () => {
  if (!io) throw new Error("Socket.io hasn't inisialize");
  return io;
};
