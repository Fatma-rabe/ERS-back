const mongoose = require("mongoose");

const equipmentRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: "EquipmentList", required: true }, 
  volume: { type: Number, required: true },
  Rentalmethod: { type: String, enum: ["By meter", "By hour"], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const EquipmentRequest = mongoose.model("EquipmentRequest", equipmentRequestSchema);
module.exports = EquipmentRequest;
