const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const warehouseRequestSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // اليوزر اللي بيطلب
    warehouseItem: { type: mongoose.Schema.Types.ObjectId, ref: "WarehouseManagement", required: true }, // الصنف اللي بيطلبه
    quantityRequested: { type: Number, required: true }, // الكمية المطلوبة
    amount: { type: Number, required: true }, // السعر الإجمالي (quantityRequested * price)
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const WarehouseRequest = mongoose.model("WarehouseRequest", warehouseRequestSchema);
module.exports = WarehouseRequest;
