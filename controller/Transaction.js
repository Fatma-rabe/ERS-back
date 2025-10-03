const Transaction = require("../models/Transaction");
const User = require("../models/user");
const mongoose = require("mongoose");

// رجّع كل المستخدمين اللي عندهم معاملات
exports.getUsersWithTransactions = async (req, res) => {
    try {
      const users = await Transaction.aggregate([
        { $group: { _id: "$user" } },
        {
          $lookup: {
            from: "users", // اسم الكولكشن الصحيح
            localField: "_id",
            foreignField: "_id",
            as: "userInfo"
          }
        },
        { $unwind: "$userInfo" },
        {
          $project: {
            _id: 0,
            userId: "$userInfo._id",
            name: "$userInfo.name",
            email: "$userInfo.email"
          }
        }
      ]);
  
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users with transactions:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  };  
// رجّع الشهور اللي فيها معاملات لليوزر
exports.getUserTransactionMonths = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const userObjId = new mongoose.Types.ObjectId(userId);

    const months = await Transaction.aggregate([
      { $match: { user: userObjId } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          totalAmount: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalAmount: 1,
          count: 1
        }
      },
      { $sort: { year: -1, month: -1 } }
    ]);

    res.status(200).json(months);
  } catch (error) {
    console.error("Error fetching months:", error);
    res.status(500).json({ message: "Failed to fetch months" });
  }
};

// رجّع كل المعاملات لشهر معين لليوزر
exports.getTransactionsByMonth = async (req, res) => {
    try {
      const { userId, year, month } = req.params;
      if (!userId || !year || !month) {
        return res.status(400).json({ message: "userId, year, and month are required" });
      }
  
      const userObjId = new mongoose.Types.ObjectId(userId);
  
      const transactions = await Transaction.aggregate([
        {
          $match: {
            user: userObjId,
            createdAt: {
              $gte: new Date(Number(year), Number(month) - 1, 1),
              $lt: new Date(Number(year), Number(month), 1)
            }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userInfo"
          }
        },
        { $unwind: "$userInfo" },
        { $sort: { createdAt: -1 } },
        {
          $project: {
            _id: 0,
            amount: { $concat: [ { $toString: "$amount" }, " EGP" ] },
            note: 1,
            userName: "$userInfo.name",
            userEmail: "$userInfo.email",
            createdAt: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M",
                date: "$createdAt",
                timezone: "Africa/Cairo"
              }
            }
          }
        }
      ]);
  
      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching transactions by month:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
};
  