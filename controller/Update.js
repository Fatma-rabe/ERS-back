// Update Password
const User = require("../models/user");
const jwt = require("jsonwebtoken");
exports.updatePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Failed to update password" });
    }
};

// Update Email
exports.updateEmail = async (req, res) => {
    try {
        const { newEmail } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.email = newEmail;
        await user.save();
        res.status(200).json({ message: "Email updated successfully" });
    } catch (error) {
        console.error("Error updating email:", error);
        res.status(500).json({ message: "Failed to update email" });
    }
};

// Update name
exports.updateName = async (req, res) => {
    try {
        const { newName } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.name = newName;
        await user.save();
        res.status(200).json({ message: "Name updated successfully" });
    } catch (error) {
        console.error("Error updating name:", error);
        res.status(500).json({ message: "Failed to update name" });
    }
};