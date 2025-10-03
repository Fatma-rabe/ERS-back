const express = require("express");
const router = express.Router();
const { verifyTokenMiddleware, isAdmin } = require("../middleware/auth");
const { updateUser } = require("../controller/Update");
router.post("/updateUser", verifyTokenMiddleware, isAdmin, updateUser);
module.exports = router;