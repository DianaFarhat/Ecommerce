const User= require("../models/userModel");
const validator= require("validator");
const jwt= require("jwt");
const {promisify}= require("util");



const signToken= (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN,}

    )
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
        res.status(500).json({message: err.message});
        console.log(err);
    }
}

exports.login= async (req, res)=> {
    try{
        const {email, password}= req.body;

        const user= await User.findOne({email});


        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        if (!(await user.checkPassword(password, user.password))){
            return res.status(401).json({message: "Either the password or email used is incorrect"})
        }
    }catch(err){

    }
}

exports.protect= async (req, res, next) => {
    try{
        //1. Verify that the token exists
        let token;
        if (req.headers.authorization && req.headers.startsWith("Bearer")){
            token= req.headers.authorization.split(" ")[1];
        }
        if (!token){
            return res.status(401).json({message: "You are not logged in"});
        }

        //2. Verify the token
        try{
            decoded= await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        }catch(err){
            if (error.name=== "JsonWebTokenError"){
                return res.status(401).json({message: "Invalid token"});
            }else if(error.name=== "TokenExpiredError"){
                return res.status(401).json({message: "Your session token has expired, pls log in again"});
            }
        }

        //3. Check if the user still exists
        const currentUser= await User.findById(decoded.id);
        if(!currentUser){
            return res.status(401).json({message: "The token owner no longer exists"});
        }

        //4. Check if the password has been changed
        if(currentUser.passwordChangedAfterTokenIssued(decoded.iat)){
            return res.status(401).json({message: "Your password has been changed, please log in again"});
        }

        //5. We add the user to all the requests
        req.user= currentUser;

    }catch(err){
        console.log(err);

    }
}