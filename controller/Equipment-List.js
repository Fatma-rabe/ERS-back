const EquipmentList = require("../models/Equipment-List");
const EquipmentRequest = require("../models/EquipmentRequest");
const User = require("../models/user");
const Transaction = require("../models/Transaction");

// Create Equipment (Admin)
exports.createEquipmentList = async (req, res) => {
    try {
        const { name, category, price} = req.body;
        if (!name || !category || !price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const equipmentList = new EquipmentList({ name, category, price });
        await equipmentList.save();

        res.status(201).json({ message: "Equipment created successfully", data: equipmentList });
    } catch (error) {
        console.error("Error creating equipment list:", error);
        res.status(500).json({ message: "Failed to create equipment list" });
    }
};

// Request Equipment (User)
exports.requestEquipment = async (req, res) => {
    try {
        const { id } = req.params; // Equipment ID
        const { volume, Rentalmethod } = req.body;

        if (!volume || !Rentalmethod) {
            return res.status(400).json({ message: "Volume and Rentalmethod are required" });
        }

        const equipment = await EquipmentList.findById(id);
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }

        const amount = volume * equipment.price;

        const newRequest = new EquipmentRequest({
            user: req.user.id,
            equipment: id,
            volume,
            amount,
            Rentalmethod,
            status: "pending"
        });

        await newRequest.save();

        res.status(201).json({
            message: "Equipment requested successfully",
            data: newRequest
        });
    } catch (error) {
        console.error("Error requesting equipment:", error.message);
        res.status(500).json({ message: "Failed to request equipment" });
    }
};

// Get All Equipment (Admin + Users)
exports.getAllEquipments = async (req, res) => {
    try {
        const equipmentList = await EquipmentList.find().sort({ createdAt: -1 });
        res.status(200).json(equipmentList);
    } catch (error) {
        console.error("Error getting equipment list:", error);
        res.status(500).json({ message: "Failed to get equipment list" });
    }
};

// Get All Requests (Admin)
exports.getAllRequests = async (req, res) => {
    try {
        const requests = await EquipmentRequest.find({ status: "pending" })
            .populate("user", "name email")
            .populate("equipment", "name category price");

        res.status(200).json(requests);
    } catch (error) {
        console.error("Error getting requests:", error);
        res.status(500).json({ message: "Failed to get requests" });
    }
};

// Get My Requests (User)
exports.getMyRequests = async (req, res) => {
    try {
        const myRequests = await EquipmentRequest.find({ user: req.user.id })
            .populate("equipment", "name category price");

        if (!myRequests || myRequests.length === 0) {
            return res.status(404).json({ message: "No requests found for this user" });
        }

        res.status(200).json(myRequests);
    } catch (error) {
        console.error("Error getting my requests:", error);
        res.status(500).json({ message: "Failed to get my requests" });
    }
};

//  Accept Request (Admin)
exports.acceptRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // لازم نعمل populate عشان يجيب بيانات المعدة كاملة
        const request = await EquipmentRequest.findById(id).populate("equipment", "name");

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        request.status = "approved";

        const transaction = new Transaction({
            user: request.user,
            amount: request.amount,
            note: `Equipment request for "${request.equipment.name}" accepted`
        });

        await transaction.save();
        await request.save();

        res.status(200).json({ message: "Request approved successfully" });
    } catch (error) {
        console.error("Error approving request:", error.message);
        res.status(500).json({ message: "Failed to approve request" });
    }
};


// Reject Request (Admin)
exports.rejectRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const request = await EquipmentRequest.findById(id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        request.status = "rejected";
        await request.save();

        res.status(200).json({ message: "Request rejected successfully" });
    } catch (error) {
        console.error("Error rejecting request:", error.message);
        res.status(500).json({ message: "Failed to reject request" });
    }
};

// Delete Equipment (Admin)
exports.deleteEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await EquipmentList.findById(id);

        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }

        await equipment.deleteOne();
        res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (error) {
        console.error("Error deleting equipment:", error.message);
        res.status(500).json({ message: "Failed to delete equipment" });
    }
};

// Update Equipment (Admin)
exports.updateEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        let equipment = await EquipmentList.findById(id);
        if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
        }

        Object.assign(equipment, updates);
        equipment.updatedAt = Date.now();

        await equipment.save();

        res.status(200).json({
            message: "Equipment updated successfully",
            data: equipment
        });
    } catch (error) {
        console.error("Error updating equipment:", error.message);
        res.status(500).json({ message: "Failed to update equipment" });
    }
};