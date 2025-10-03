const mongoose = require("mongoose");
const maintenanceRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
  amount: { type: Number },
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const MaintenanceRequest = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
module.exports = MaintenanceRequest;
