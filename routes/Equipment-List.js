const express = require("express");
const router = express.Router();
const { verifyTokenMiddleware, isAdmin } = require("../middleware/auth");
const {
    createEquipmentList,
    requestEquipment,
    getAllEquipments,
    getAllRequests,
    getMyRequests,
    acceptRequest,
    rejectRequest,
    deleteEquipment,
    updateEquipment
} = require("../controller/Equipment-List");

//  Admin
router.post("/create", verifyTokenMiddleware, isAdmin, createEquipmentList);
router.get("/requests", verifyTokenMiddleware, isAdmin, getAllRequests);
router.get("/all", verifyTokenMiddleware, getAllEquipments);
router.put("/accept/:id", verifyTokenMiddleware, isAdmin, acceptRequest);
router.put("/reject/:id", verifyTokenMiddleware, isAdmin, rejectRequest);
router.delete("/delete/:id", verifyTokenMiddleware, isAdmin, deleteEquipment);
router.put("/update/:id", verifyTokenMiddleware, isAdmin, updateEquipment);
//  Users
router.get("/all", verifyTokenMiddleware, getAllEquipments);
router.post("/request/:id", verifyTokenMiddleware, requestEquipment);
router.get("/myRequests", verifyTokenMiddleware, getMyRequests);

module.exports = router;
