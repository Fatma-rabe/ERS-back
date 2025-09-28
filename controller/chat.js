const Message = require("../models/message");

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId },
        { senderId: receiverId, receiverId: req.user.id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "name email")
      .populate("receiverId", "name email");

    res.json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { receiverId } = req.params;

    const result = await Message.updateMany(
      { senderId: receiverId, receiverId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({ updatedCount: result.modifiedCount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
