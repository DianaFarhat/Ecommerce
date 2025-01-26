const User= require("../models/userModel");
const validator= require("validator");
const jwt= require("jwt");




const signToken= (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

const createSendToken= (user, statusCode, res)=>{
    const token= signToken(user._id);
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,

        }
    })
}

exports.signup= async (req, res) =>{
    try{
        const emailCheck= await User.findOne({email: req.body.email});
        if (emailCheck){
            return res.status(409).json({message: "The email is already in use"})
        }
        if(!validator.isEmail(req.body.email)){
            return res.status(400).json({message: "Please enter a valid email"})
        }
        if(req.body.password != req.body.passwordConfirm){
            return res.status(400).json({message: "The passwords you entered do not match"})
        }
       
        const newUser= await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role
        });

        createSendToken(newUser, 201, res);
        /*
        return res.status(201).json({
            message:"User created successfully",
            data: {newUser}
        })
            */
    }
    catch(err){
        res.status(500).json({message: err.message})
        console.log(err)
    }
}