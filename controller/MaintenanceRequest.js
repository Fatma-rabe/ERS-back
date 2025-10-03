// Create Maintenance Request
const User = require("../models/user");
const Transaction = require("../models/Transaction");
const MaintenanceRequest = require("../models/Maintenance-request");
exports.createMaintenanceRequest = async (req, res) => {
    try {
        const { name, message } = req.body;
        const user = await User.findById(req.user.id);
        const maintenanceRequest = new MaintenanceRequest({ name, message, user, status: "pending" });
        await maintenanceRequest.save();
        res.status(201).json({ message: "Maintenance request created successfully" }, maintenanceRequest);
    } catch (error) {
        console.error("Error creating maintenance request:", error);
        res.status(500).json({ message: "Failed to create maintenance request" });
    }
};

// Get Maintenance Requests
exports.getMaintenanceRequests = async (req, res) => {
    try {
        const maintenanceRequests = await MaintenanceRequest
        .find({ status: "pending" })
        .populate("user", "name"); 
        res.status(200).json(maintenanceRequests);
    } catch (error) {
        console.error("Error getting maintenance requests:", error);
        res.status(500).json({ message: "Failed to get maintenance requests" });
    }
};
// Accept Maintenance Request
exports.acceptMaintenanceRequest = async (req, res) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
  
      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }
  
      const maintenanceRequest = await MaintenanceRequest.findById(id);
      if (!maintenanceRequest) {
        return res.status(404).json({ message: "Maintenance request not found" });
      }
  
      // تحديث الحالة والمبلغ
      maintenanceRequest.status = "approved";
      maintenanceRequest.amount = amount;
  
      // إنشاء معاملة جديدة
      const transaction = new Transaction({
        user: maintenanceRequest.user,
        amount,
        note: `Maintenance request "${maintenanceRequest.name}" accepted`
      });
  
      await transaction.save();
      await maintenanceRequest.save();
  
      res.status(200).json({ message: "Maintenance request accepted successfully" });
    } catch (error) {
      console.error("Error accepting maintenance request:", error);
      res.status(500).json({ message: "Failed to accept maintenance request" });
    }
  };
  
// Reject Maintenance Request
exports.rejectMaintenanceRequest = async (req, res) => {
    try {
        const {id} = req.params;
        const maintenanceRequest = await MaintenanceRequest.findById(id);
        if (!maintenanceRequest) {
            return res.status(404).json({ message: "Maintenance request not found" });
        }
        maintenanceRequest.status = "rejected";
        await maintenanceRequest.save();
        res.status(200).json({ message: "Maintenance request rejected successfully" });
    } catch (error) {
        console.error("Error rejecting maintenance request:", error);
        res.status(500).json({ message: "Failed to reject maintenance request" });
    }
};

// Get Maintenance Request
exports.getMaintenanceRequest = async (req, res) => {
    try {
        const  id  = req.user.id;
        const maintenanceRequests = await MaintenanceRequest.find({ user: id });
        if (!maintenanceRequests || maintenanceRequests.length === 0) {
          return res.status(404).json({ message: "No maintenance requests found for this user" });
        }
        res.status(200).json(maintenanceRequests);
    } catch (error) {
        console.error("Error getting maintenance request:", error);
        res.status(500).json({ message: "Failed to get maintenance request" });
    }
};

