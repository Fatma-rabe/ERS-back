const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const warehouseManagementSchema = new Schema({
    Itemname: {
        type: String,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const WarehouseManagement = mongoose.model("WarehouseManagement", warehouseManagementSchema);
module.exports = WarehouseManagement;
