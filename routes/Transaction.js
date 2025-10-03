const express = require("express");
const router = express.Router();
const { verifyTokenMiddleware , isAdmin } = require("../middleware/auth");
const  {getUsersWithTransactions , getUserTransactionMonths , getTransactionsByMonth  }= require("../controller/Transaction");
router.get("/GetUsersWithTransactions", verifyTokenMiddleware,isAdmin , getUsersWithTransactions);
router.get("/GetUserTransactionMonths/:userId", verifyTokenMiddleware,isAdmin , getUserTransactionMonths);
router.get("/GetTransactionsByMonth/:userId/:year/:month", verifyTokenMiddleware,isAdmin , getTransactionsByMonth);
module.exports = router;