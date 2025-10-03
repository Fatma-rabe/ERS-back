const express = require("express");
const router = express.Router();
const { verifyTokenMiddleware, isAdmin } = require("../middleware/auth");
const {
    createWarehouseManagement,
    requestWarehouseManagement,
    acceptWarehouseRequest,
    rejectWarehouseRequest,
    getAllWarehouseManagement,
    getWarehouseRequests,
    getMyWarehouseManagement,
    updateWarehouseManagement,
    deleteWarehouseManagement,
} = require("../controller/Warehouse-management");

// Admin
router.post("/create", verifyTokenMiddleware, isAdmin, createWarehouseManagement);
router.post("/getRequests", verifyTokenMiddleware,isAdmin, getWarehouseRequests);
router.post("/getAll", verifyTokenMiddleware, getAllWarehouseManagement);
router.put("/accept/:id", verifyTokenMiddleware,isAdmin, acceptWarehouseRequest);
router.put("/reject/:id", verifyTokenMiddleware,isAdmin, rejectWarehouseRequest);
router.put("/update/:id", verifyTokenMiddleware,isAdmin, updateWarehouseManagement);
router.delete("/delete/:id", verifyTokenMiddleware,isAdmin, deleteWarehouseManagement);

// User
router.post("/request/:id", verifyTokenMiddleware, requestWarehouseManagement);
router.get("/getMyRequests", verifyTokenMiddleware, getMyWarehouseManagement);
router.get("/getAll", verifyTokenMiddleware, getAllWarehouseManagement);
module.exports = router;