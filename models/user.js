const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    // name of user
    name: {type: String, required: true},
    // email of user
    email: {type: String, unique: true, required: true
        ,
        // validate email
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    // password of user
    password: {type: String, required: true},
    // role of user
    role: {type: String, enum: ["user", "admin"], default: "user"}
});

// hash password before save
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); // لو الباسورد ما اتغيرش، كمل عادي
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
  

const User = mongoose.model("User", userSchema);
module.exports = User;
