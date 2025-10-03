const express = require("express");
const router = express.Router();
const { verifyTokenMiddleware, isAdmin } = require("../middleware/auth");
const {
  createWorkerManagement,
  requestWorkerManagement,
  getWorkerRequests,
  getAllWorkerManagement,
  getMyWorkerManagement,
  acceptWorkerRequest,
  rejectWorkerRequest,
  updateWorkerManagement,
  deleteWorkerManagement
} = require("../controller/Theworker-management");

// Admin adds worker
router.post("/create", verifyTokenMiddleware, isAdmin, createWorkerManagement);

// User requests worker
router.post("/request/:id", verifyTokenMiddleware, requestWorkerManagement);

// Get all workers (public)
router.get("/GetAllWorker", verifyTokenMiddleware, getAllWorkerManagement);

// Get all worker requests (admin review)
router.get("/GetWorkerRequests", verifyTokenMiddleware, isAdmin, getWorkerRequests);

// Update worker (admin only)
router.put("/UpdateWorker/:id", verifyTokenMiddleware, isAdmin, updateWorkerManagement);

// Get my worker requests (user)
router.get("/myWorkerRequests", verifyTokenMiddleware, getMyWorkerManagement);

// Accept worker request (admin)
router.put("/accept/:id", verifyTokenMiddleware, isAdmin, acceptWorkerRequest);

// Reject worker request (admin)
router.put("/reject/:id", verifyTokenMiddleware, isAdmin, rejectWorkerRequest);

// Delete worker (admin only)
router.delete("/DeleteWorker/:id", verifyTokenMiddleware, isAdmin, deleteWorkerManagement);

module.exports = router;
