const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
    
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
    
        // Create new user (password will be hashed by userSchema pre-save hook)
        const newUser = await User.create({ name, email, password, role });
        // Response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
        });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = {register};