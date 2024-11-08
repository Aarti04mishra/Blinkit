const express=require('express');
const router=express.Router();
const upload=require('../config/multer-config');
const { categoryModel } = require('../models/categoryModel');
const {validateAdmin} = require('../middlewares/validate');

router.post("/create",validateAdmin,async function(req,res){
  let category=await categoryModel.create({
    name:req.body.name
  })

  res.redirect("back");
})




module.exports=router;