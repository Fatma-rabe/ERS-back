const Message = require("../models/message");
let onlineUsers = {};

function initChatSocket(io) {
  // Middleware للتحقق من JWT
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication error"));
    const jwt = require("jsonwebtoken");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    onlineUsers[socket.user.id] = socket.id;
    console.log("Connected:", socket.user.id);

    // إرسال رسالة real-time
    socket.on("send_message", async (data) => {
      const { receiverId, message } = data;
      const senderId = socket.user.id;

      const newMessage = new Message({ senderId, receiverId, message });
      await newMessage.save();

      const receiverSocket = onlineUsers[receiverId];
      if (receiverSocket) {
        io.to(receiverSocket).emit("receive_message", newMessage);
      }
    });

    // تعليم كل الرسائل من شخص كمقروءة
    socket.on("mark_as_read", async ({ senderId }) => {
      const receiverId = socket.user.id;
      const result = await Message.updateMany(
        { senderId, receiverId, isRead: false },
        { isRead: true }
      );

      const senderSocket = onlineUsers[senderId];
      if (senderSocket) {
        io.to(senderSocket).emit("messages_read", { receiverId, updatedCount: result.modifiedCount });
      }
    });

    socket.on("disconnect", () => {
      delete onlineUsers[socket.user.id];
    });
  });
}

module.exports = initChatSocket;
