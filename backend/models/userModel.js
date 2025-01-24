const mongoose= require("mongoose");
const { trim } = require("validator");
const Schema= mongoose.Schema;

const userSchema= new mongoose.Schema({
    firstName:{
        type: String,
        required: [true, "Please enter your first name"],
        minLength: 3,
        trim: 2,
    },
    lastName:{
        type: String,
        required: [true, "Please enter your last name"],
        minLength: 3,
        trim: 2,
    }, 
    email:{
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: [true, "Please enter your email"],
    },
    username:{
        type: String,
        unique: true,
        trim: true,
        required: [true, "Please enter your username"],
    },
    password: {
        type: String,
        minLength: 8,
        trim: true,
        required: [true, "Please enter your password"],
    },
    passwordConfirm: {
        type: String,
        minLength: 8,
        trim: true,
        required: [true, "Please confirm your password"],
    },
    passwordChangedAt: Date,

    role: {
        type: String,
        default: "user",
        enum: ["admin", "user"],
    },
    
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order",
        }
    ],
},
{timestamps: true}
)

module.exports= mongoose.model("User", userSchema);
