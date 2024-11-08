const express=require('express');
const router=express.Router();
const {productModel,validateProduct}=require("../models/productModel");
const upload=require('../config/multer-config');
const { categoryModel } = require('../models/categoryModel');
const {validateAdmin} = require('../middlewares/validate');

router.get("/",async function(req,res){
    let prods=await productModel.find();
    res.send(prods)
})

router.post("/",upload.single('image'),async function(req,res){
    let {name,price,category,stock,description,image}=req.body;
    
    let {error}=validateProduct({
         name,
         price,
         category,
         stock,
         description,
         image
    })

    if(error) return res.send(error.message);

    let isCategory=await categoryModel.findOne({name:category});
    
    if(!isCategory){
        await categoryModel.create({
            name:category
        })
    }

    let products=await productModel.create({
        name,
        price,
        category,
        stock,
        description,
        image:req.file.buffer
    })
    
    res.send("product created");

})

router.get('/delete/:id',validateAdmin,async function(req,res){
  if(req.user.admin){
    await productModel.findOneAndDelete({_id:req.params.id});
    return res.redirect("/admin/products");
  }
  res.send("only admin can delete it");
})
router.post('/delete',validateAdmin,async function(req,res){
    if(req.user.admin){
      console.log(req.body)
      await productModel.findOneAndDelete({_id:req.body.product_id});
      return res.redirect("back");
    }
    res.send("only admin can delete it");
  })

module.exports=router;