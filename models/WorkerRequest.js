const mongoose = require("mongoose");

const workerRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  worker: { type: mongoose.Schema.Types.ObjectId, ref: "WorkerManagement", required: true },
  days: { type: Number, required: true },  // عدد الأيام 
  amount: { type: Number, required: true }, // الإجمالي (days * worker.amount)
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

const WorkerRequest = mongoose.model("WorkerRequest", workerRequestSchema);

module.exports = WorkerRequest;
