const WorkerManagement = require("../models/Theworker-management");
const WorkerRequest = require("../models/WorkerRequest");
const User = require("../models/user");
const Transaction = require("../models/Transaction");

// Create worker by admin
exports.createWorkerManagement = async (req, res) => {
  try {
    const { name, worker, phone, amount, note } = req.body;
    if (!name || !worker || !phone || !amount) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const workerManagement = new WorkerManagement({
      name,
      worker,
      phone,
      amount,
      note
    });

    await workerManagement.save();
    res.status(201).json({ message: "Worker created successfully by admin" });
  } catch (error) {
    console.error("Error creating worker:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Request worker by user
exports.requestWorkerManagement = async (req, res) => {
  try {
    const { id } = req.params; // ID العامل
    const { days} = req.body;

    if (!days) {
      return res.status(400).json({ message: "Days are required" });
    }

    const worker = await WorkerManagement.findById(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const totalAmount = days * worker.amount;

    const workerRequest = new WorkerRequest({
      user: req.user.id,
      worker: id,
      days,
      amount: totalAmount
    });

    await workerRequest.save();

    res.status(201).json({
      message: "Worker requested successfully",
      data: workerRequest
    });
  } catch (error) {
    console.error("Error requesting worker:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept worker request
exports.acceptWorkerRequest = async (req, res) => {
    try {
      const { id } = req.params;
  
      // populate user بالاسم فقط
      const workerRequest = await WorkerRequest.findById(id)
        .populate("worker", "name")
        .populate("user", "name");
  
      if (!workerRequest) {
        return res.status(404).json({ message: "Worker request not found" });
      }
  
      workerRequest.status = "approved";
      await workerRequest.save();
  
      // create transaction
      const transaction = new Transaction({
        user: workerRequest.user,
        amount: workerRequest.amount,
        note: `Worker "${workerRequest.worker.name}" request approved by ${workerRequest.user.name}`
      });
      await transaction.save();
  
      res.status(200).json({ message: "Worker request approved successfully" });
    } catch (error) {
      console.error("Error approving worker request:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// Reject worker request
exports.rejectWorkerRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const workerRequest = await WorkerRequest.findById(id);
    if (!workerRequest) {
      return res.status(404).json({ message: "Worker request not found" });
    }
    workerRequest.status = "rejected";
    await workerRequest.save();
    res.status(200).json({ message: "Worker request rejected successfully" });
  } catch (error) {
    console.error("Error rejecting worker request:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all workers (added by admin)
exports.getAllWorkerManagement = async (req, res) => {
  try {
    const workers = await WorkerManagement.find().sort({ createdAt: -1 });
    res.status(200).json(workers);
  } catch (error) {
    console.error("Error getting workers:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all worker requests (admin review)
exports.getWorkerRequests = async (req, res) => {
    try {
      const requests = await WorkerRequest.find()
        .populate("user", "name")    // بس الاسم بتاع اليوزر
        .populate("worker", "name , worker"); // بس الاسم بتاع العامل
  
      res.status(200).json(requests);
    } catch (error) {
      console.error("Error getting worker requests:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  

// Get my worker requests (user)
exports.getMyWorkerManagement = async (req, res) => {
  try {
    const workerRequests = await WorkerRequest.find({ user: req.user.id }).populate("worker");
    res.status(200).json(workerRequests);
  } catch (error) {
    console.error("Error getting my requests:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update worker
exports.updateWorkerManagement = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body; 
  
      // لقي الـ workerManagement
      let workerManagement = await WorkerManagement.findById(id);
      if (!workerManagement) {
        return res.status(404).json({ message: "Worker not found" });
      }
  
      Object.assign(workerManagement, updates);
      workerManagement.updatedAt = Date.now();
  
      await workerManagement.save();
  
      res.status(200).json({
        message: "Worker updated successfully",
        data: workerManagement
      });
    } catch (error) {
      console.error("Error updating worker:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
//   delete worker
exports.deleteWorkerManagement = async (req, res) => {
    try {
      const { id } = req.params;
      const workerManagement = await WorkerManagement.findById(id);
      if (!workerManagement) {
        return res.status(404).json({ message: "Worker not found" });
      }
      await workerManagement.deleteOne();
      res.status(200).json({ message: "Worker deleted successfully" });
    } catch (error) {
      console.error("Error deleting worker:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };