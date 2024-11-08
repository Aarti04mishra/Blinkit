const express=require("express");
const router=express.Router();
const {productModel}=require("../models/productModel")
const {validateAdmin,isUserLoggedin} = require('../middlewares/validate');
const { cartModel } = require("../models/cartModel");

router.get("/",isUserLoggedin,async function(req,res){
     let somethingInCart=false;
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
      let cart= await cartModel.findOne({user:req.session.passport.user});
      let cartCount=cart?cart.products.length:0;
      if(cart && cart.products.length>0) somethingInCart=true;
      const products = result.reduce((acc, category) => {
        acc[category._id] = category.products;
        return acc;
      }, {});

     

      let rnproducts = await productModel.aggregate([{$sample: {size: 3}}]);
      res.render("index",{products,rnproducts,somethingInCart,cartCount})

});

router.get("/map/:orderid",function(req,res){
  res.render("map",{orderid:req.params.orderid});
})

module.exports=router;