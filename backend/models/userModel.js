const mongoose= require("mongoose");
const { trim } = require("validator");
const Schema= mongoose.Schema;
const bcrypt= require('bcrypt');

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

userSchema.pre("save", async function(next){
    try{
        if (!this.isModified("password")){
            return next();
        }
        this.password= await bcrypt.hash(this.password, 12);
        this.passwordConfirm= undefined;

    }catch(err){
        console.log(err);
    }
})

userSchema.methods.checkPassword= async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.passwordChangedAfterTokenIssuance= async function(JWTTimesstamp){
    if (this.passwordChangedAt){
        const passwordChangeTime= parseInt(this.passwordChangedAt.getTime()/1000);
        return passwordChangeTime > JWTTimesstamp;
    }
    
    return false;
    
}

module.exports= mongoose.model("User", userSchema);
