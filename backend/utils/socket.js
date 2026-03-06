const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const ChatMessage = require('../models/ChatMessage');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    });

    // Auth middleware for socket
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error('Authentication error'));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Socket connected: ${socket.id} (User: ${socket.userId})`);

        // Join personal notification room
        socket.join(`user_${socket.userId}`);

        // Join chat room
        socket.on('join_chat', ({ roomId }) => {
            socket.join(roomId);
            console.log(`User ${socket.userId} joined room ${roomId}`);
        });

        // Send message
        socket.on('send_message', async ({ roomId, receiverId, content, messageType = 'text', senderRole }) => {
            try {
                const message = await ChatMessage.create({
                    room: roomId,
                    sender: socket.userId,
                    receiver: receiverId,
                    senderRole,
                    content,
                    messageType,
                });

                const populated = await message.populate('sender', 'name avatar role');

                // Emit to all in room
                io.to(roomId).emit('new_message', populated);

                // Notify receiver if not in room
                io.to(`user_${receiverId}`).emit('notification', {
                    type: 'new_message',
                    message: `New message from ${populated.sender.name}`,
                });
            } catch (err) {
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Mark messages as read
        socket.on('mark_read', async ({ roomId }) => {
            await ChatMessage.updateMany(
                { room: roomId, receiver: socket.userId, isRead: false },
                { isRead: true, readAt: new Date() }
            );
            io.to(roomId).emit('messages_read', { roomId, userId: socket.userId });
        });

        // Typing indicator
        socket.on('typing', ({ roomId, isTyping }) => {
            socket.to(roomId).emit('user_typing', { userId: socket.userId, isTyping });
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) throw new Error('Socket.io not initialized');
    return io;
};

module.exports = { initSocket, getIo };
