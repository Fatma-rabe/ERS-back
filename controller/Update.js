// Update User
const User = require("../models/user");
exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body; 
  
      // لقي الـ workerManagement
      let user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      Object.assign(user, updates);
      user.updatedAt = Date.now();
  
      await user.save();
  
      res.status(200).json({
        message: "User updated successfully",
        data: user
      });
    } catch (error) {
      console.error("Error updating user:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };

//   delete user
exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.deleteOne();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error.message);
      res.status(500).json({ message: "Server error" });
    }
  };
  