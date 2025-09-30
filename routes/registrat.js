const express = require("express");
const router = express.Router();
const { verifyTokenMiddleware, isAdmin } = require("../middleware/auth");
const { register } = require("../controller/registrat");
const cors = require("cors");
router.use(cors({
  origin: "*"
}));
router.post("/", verifyTokenMiddleware, isAdmin, register);
module.exports = router;
