const WarehouseManagement = require("../models/Warehouse-management");
const WarehouseRequest = require("../models/WarehouseRequest");
const User = require("../models/user");
const Transaction = require("../models/Transaction");

// Create warehouse item by admin
exports.createWarehouseManagement = async (req, res) => {
  try {
    const { Itemname, Quantity, price } = req.body;
    if (!Itemname || !Quantity || !price) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const warehouseItem = new WarehouseManagement({
      Itemname,
      Quantity,
      price
    });

    await warehouseItem.save();
    res.status(201).json({ message: "Warehouse item created successfully by admin" });
  } catch (error) {
    console.error("Error creating warehouse item:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Request warehouse item by user
exports.requestWarehouseManagement = async (req, res) => {
    try {
      const { id } = req.params; // ID الصنف
      const { quantityRequested } = req.body;
  
      if (!quantityRequested) {
        return res.status(400).json({ message: "Quantity requested is required" });
      }
  
      // الأول نجيب الصنف من المخزن
      const warehouseItem = await WarehouseManagement.findById(id);
      if (!warehouseItem) {
        return res.status(404).json({ message: "Warehouse item not found" });
      }
  
      // تحقق من الكمية المتاحة
      if (quantityRequested > warehouseItem.Quantity) {
        return res.status(400).json({ message: "Not enough quantity available" });
      }
  
      // حساب السعر الإجمالي
      const totalAmount = quantityRequested * warehouseItem.price;
  
      // إنشاء طلب
      const warehouseRequest = new WarehouseRequest({
        user: req.user.id,
        warehouseItem: warehouseItem._id,
        quantityRequested,
        amount: totalAmount,
        status: "pending"
      });
  
      await warehouseRequest.save();
  
      res.status(201).json({
        message: "Warehouse item requested successfully",
        data: warehouseRequest
      });
    } catch (error) {
      console.error("Error requesting warehouse item:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// Accept warehouse request
exports.acceptWarehouseRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // populate user + item
    const warehouseRequest = await WarehouseRequest.findById(id)
      .populate("warehouseItem", "Itemname")
      .populate("user", "name");

    if (!warehouseRequest) {
      return res.status(404).json({ message: "Warehouse request not found" });
    }

    warehouseRequest.status = "approved";
    await warehouseRequest.save();

    // update warehouse item quantity
    const warehouseItem = await WarehouseManagement.findById(warehouseRequest.warehouseItem);
    warehouseItem.Quantity -= warehouseRequest.quantityRequested;
    await warehouseItem.save();

    // create transaction
    const transaction = new Transaction({
      user: warehouseRequest.user,
      amount: warehouseRequest.amount,
      note: `Warehouse item "${warehouseRequest.warehouseItem.Itemname}" request approved by ${warehouseRequest.user.name}`
    });
    await transaction.save();

    res.status(200).json({ message: "Warehouse request approved successfully" });
  } catch (error) {
    console.error("Error approving warehouse request:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject warehouse request
exports.rejectWarehouseRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouseRequest = await WarehouseRequest.findById(id);
    if (!warehouseRequest) {
      return res.status(404).json({ message: "Warehouse request not found" });
    }
    warehouseRequest.status = "rejected";
    await warehouseRequest.save();
    res.status(200).json({ message: "Warehouse request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting warehouse request:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all warehouse items (added by admin)
exports.getAllWarehouseManagement = async (req, res) => {
  try {
    const items = await WarehouseManagement.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.error("Error getting warehouse items:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all warehouse requests (admin review)
exports.getWarehouseRequests = async (req, res) => {
  try {
    const requests = await WarehouseRequest.find({ status: "pending" })
      .populate("user", "name")    
      .populate("warehouseItem", "Itemname Quantity price"); 
  
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error getting warehouse requests:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get my warehouse requests (user)
exports.getMyWarehouseManagement = async (req, res) => {
    try {
      const warehouseRequests = await WarehouseRequest.find({ user:req.user.id }).populate("warehouseItem");
      res.status(200).json(warehouseRequests);
    } catch (error) {
      console.error("Error getting my requests:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// Update warehouse item
exports.updateWarehouseManagement = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      let warehouseItem = await WarehouseManagement.findById(id);
      if (!warehouseItem) {
        return res.status(404).json({ message: "Warehouse item not found" });
      }
  
      if (updates.Quantity !== undefined) {
        warehouseItem.Quantity = updates.Quantity;
      }
  
      if (updates.addQuantity !== undefined) {
        warehouseItem.Quantity += updates.addQuantity;
      }
  
     
      Object.assign(warehouseItem, updates);
  
      warehouseItem.updatedAt = Date.now();
      await warehouseItem.save();
  
      res.status(200).json({
        message: "Warehouse item updated successfully",
        data: warehouseItem
      });
    } catch (error) {
      console.error("Error updating warehouse item:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// Delete warehouse item
exports.deleteWarehouseManagement = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouseItem = await WarehouseManagement.findById(id);
    if (!warehouseItem) {
      return res.status(404).json({ message: "Warehouse item not found" });
    }
    await warehouseItem.deleteOne();
    res.status(200).json({ message: "Warehouse item deleted successfully" });
  } catch (error) {
    console.error("Error deleting warehouse item:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
