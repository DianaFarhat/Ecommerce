const Product= require("../models/productModel");
const User= require("../models/userModel");

const checkAdmin= async (req)=>{
    try{
        const user= await User.findOne({_id: req.user._id});
        if (!user || user.role !== "admin"){
            return false;
        }else{
            return true;
        }
    }catch(err){
        console.log(err);
    }
}

exports.createProduct= async (req, res)=>{
    try{
        const user= await checkAdmin(req);
        if (user===false){
            return res.status(401).json({message: "Only admins can create products"});
        }
        const newProduct= await Product.create({
            productName: req.body.productName,
            productDescription: req.body.productDescription,
            productPrice: req.body.productPrice,
            productQuantity: req.body.productQuantity,
            createdBy: req.use._id,
        });

        return res.status(201).json({message: "Product has been added successfully", product: newProduct});
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

exports.updateProduct= async (req, res)=>{
    try{
        // Check if user is admin
        const user= await checkAdmin(req);
        if (user===false){
            return res.status(401).json({message: "Only admins can update products"});
        }
        // Update 
        const product= await Product.findByIdAndUpdate(req.params.productID, req.body, {new: true});

        //Ckeck if Product 
        if (!product){
            return res.status(404).json({message: "Product not found"});
        }
        return res.status(200).json({message: "Product updated successfully"});

    }catch(err){

    }
}

exports.deleteProduct= async (req, res)=>{
    try{
        // Check if user is admin
        const user= await checkAdmin(req);
        if (user===false){
            return res.status(401).json({message: "Only admins can delete products"});
        }
        // Update 
        const product= await Product.findByIdAndDelete(req.params.productID);

        //
        if (!product){
            return res.status(404).json({message: "Product not found"});
        }
        return res.status(200).json({message: "Product deleted successfully"});

    }catch(err){

    }
}

exports.getAllProducts= async (req, res) =>{
    try{
        const products= await Product.find();
        if (products.length <=0){
            return res.status(404).json({message:"No available products"});
        }
        return res.status(200).json(products);

    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

//You can add get product by ID