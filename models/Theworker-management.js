const mongoose = require("mongoose");
const workerManagementSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: { type: String,},
    worker: { type: String,},
    Days: { type: Number},
    phone: { type: String,},
    amount: { type: Number,},
    note: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"]},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const WorkerManagement = mongoose.model("WorkerManagement", workerManagementSchema);
module.exports = WorkerManagement;
