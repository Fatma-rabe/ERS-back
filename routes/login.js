const express = require("express");
const router = express.Router();
const cors = require("cors");
const { login } = require("../controller/login");
router.use(cors({
  origin: "*"
}));
router.post("/", login);
module.exports=router;