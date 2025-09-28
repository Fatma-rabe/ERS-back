const express = require("express");
const router = express.Router();
const { verifyTokenMiddleware } = require("../middleware/auth");
const { getMessages, sendMessage, markAsRead } = require("../controller/chat");

// استرجاع الرسائل بين user الحالي و receiverId
router.get("/:receiverId", verifyTokenMiddleware, getMessages);

// إرسال رسالة
router.post("/", verifyTokenMiddleware, sendMessage);

// تعليم الرسائل كمقروءة
router.put("/:receiverId/read", verifyTokenMiddleware, markAsRead);

module.exports = router;
