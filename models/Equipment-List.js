const mongoose = require("mongoose");
const equipmentListSchema = new mongoose.Schema({
    name: { type: String, require:true},
    category: { type: String, require:true},
    price: { type: Number, require:true},
    createdAt: { type: Date, default: Date.now }
});

const EquipmentList = mongoose.model("EquipmentList", equipmentListSchema);

module.exports = EquipmentList;