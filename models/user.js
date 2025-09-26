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
userSchema.pre("save",async function(next){
    const salt = bcrypt.genSaltSync(10);
    var hashpassword = await bcrypt.hash(this.password,salt);
    this.password = hashpassword;
    next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
