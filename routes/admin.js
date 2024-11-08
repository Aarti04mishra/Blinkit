const express=require('express');
const router=express.Router();
require("dotenv").config();
const {adminModel}=require("../models/adminModel");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {validateAdmin} = require('../middlewares/validate');
const { productModel } = require('../models/productModel');
const {categoryModel}=require('../models/categoryModel');

if (process.env.NODE_STATE!==undefined && process.env.NODE_STATE==="DEVELOPMENT"){
    router.get("/create",async function(req,res){
     try{
        const salt=await bcrypt.genSalt(10);
        const hash=await bcrypt.hash("admin",salt);
        let user=new adminModel({
            name:"Aarti Mishra",
            email:"test@blinkit.com",
            password:hash,
            role:"Admin"
         })
         
         user.save();
        const token= jwt.sign({email:"test@blinkit.com",admin:true},process.env.JWT_SECRET);
        res.cookie("token", token);
        res.send("admin sccessfully created");
     }
     catch(err){
        res.send(err);
     }
    })
}

router.get("/login",(req,res)=>{
    res.render("admin_login");
})

router.post("/login",async(req,res)=>{
  try{
    const {email,password}=req.body;
    const admin=await adminModel.findOne({email});
    if(!admin) return res.send("admin not found");
    let valid=await bcrypt.compare(password,admin.password);  
    if(valid){
        const token= jwt.sign({email:"test@blinkit.com",admin:true},process.env.JWT_SECRET);
        res.cookie("token", token);
        return res.redirect("/admin/dashboard")
    }

    res.send("invalid credentials")
  }
  catch(err){
    res.send(err.message);
  }
})

router.get("/dashboard",validateAdmin,async(req,res)=>{
   let prodcount=await productModel.countDocuments();
   let categcount=await categoryModel.countDocuments();

  res.render("admin_dashboard",{prodcount,categcount});
})

router.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/admin/login");
})

router.get("/products",async(req,res)=>{
  const result = await productModel.aggregate([
    {
      $group: {
        _id: "$category", // Group by the category field in ProductModel
        products: { $push: "$$ROOT" } // Push each product to the array
      }
    },
    {
      $project: {
        _id: 1, // Category name (from the category field in ProductModel)
        products: { $slice: ["$products", 10] } // Limit to 10 products per category
      }
    }
  ]);
  
  // Transform the result into an object where category names are keys
  const products = result.reduce((acc, category) => {
    acc[category._id] = category.products;
    return acc;
  }, {});

  res.render("admin_products",{products})
  
})


module.exports=router;