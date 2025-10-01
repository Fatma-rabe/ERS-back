const express = require("express");
const router = express.Router();
const { verifyTokenMiddleware, isAdmin } = require("../middleware/auth");
const { updatePassword, updateEmail, updateName } = require("../controller/Update");
router.post("/update-password", verifyTokenMiddleware , isAdmin,  updatePassword);
router.post("/update-email", verifyTokenMiddleware, isAdmin, updateEmail);
router.post("/update-name", verifyTokenMiddleware, isAdmin, updateName);

module.exports = router;