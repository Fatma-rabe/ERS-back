const Message = require("../models/message");
let onlineUsers = {};

function initChatSocket(io) {
  require("../middleware/socketAuth")(io); // اربط socket middleware

  io.on("connection", (socket) => {
    console.log("⚡ Connected:", socket.user.id);

    // حفظ المستخدم كأونلاين
    onlineUsers[socket.user.id] = socket.id;

    // إرسال رسالة
    socket.on("send_message", async (data) => {
      try {
        const { receiverId, message } = data;
        const senderId = socket.user.id; // من التوكن 👌
        console.log(socket.user.id)
        const newMessage = new Message({ senderId, receiverId, message });
        await newMessage.save();

        // لو المستلم أونلاين ابعتله
        const receiverSocket = onlineUsers[receiverId];
        if (receiverSocket) {
          io.to(receiverSocket).emit("receive_message", newMessage);
        }
      } catch (err) {
        console.error("❌ Error:", err.message);
      }
    });

    // قطع الاتصال
    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
      for (let userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
    });
  });
}

module.exports = initChatSocket;
