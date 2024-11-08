const express=require('express');
const router=express.Router();
const {validateAdmin,isUserLoggedin} = require('../middlewares/validate');
const {cartModel}=require('../models/cartModel');
const { productModel } = require('../models/productModel');

router.get("/",isUserLoggedin,async function(req,res){
   try{
    let cart=await cartModel
    .findOne({user:req.session.passport.user})
    .populate("products");

   
    let cartDataStructures={};

    cart.products.forEach(function(elem){
      let key=elem._id.toString();
      console.log(key);
      if(cartDataStructures[key]){
        cartDataStructures[key].quantity+=1;
      }
      else{
        cartDataStructures[key]={
          ...elem._doc,
          quantity:1
        }
      }
    })
    
    let finalArray=Object.values(cartDataStructures);
    
    let finalprice=cart.totalPrices+34
    
    res.render("cart",{cart:finalArray,finalprice,userid:req.session.passport.user});
   }
   catch(err){res.send(err);}
})

router.get("/add/:id", isUserLoggedin, async function(req, res) {
    try {
  
      let cart = await cartModel.findOne({ user: req.session.passport.user });
      let product = await productModel.findOne({ _id: req.params.id }).select('price');
      
      if (!product) {
        return res.status(404).send("Product not found");
      }
  
      if (!cart) {
        cart = await cartModel.create({
          user: req.session.passport.user,
          products: [req.params.id], 
          totalPrices: Number(product.price)
        });
      } else {
    
       
        cart.products.push(req.params.id);  
  
     
        cart.totalPrices += Number(product.price);
  
     
        await cart.save();
      }
  
      res.redirect("back");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });
  
  router.get("/remove/:id", isUserLoggedin, async function(req, res) {
    try {
      // Find the user's cart
      let cart = await cartModel.findOne({ user: req.session.passport.user });
  
      if (!cart) {
        return res.status(404).send("Cart not found");
      }
  
      // Find the index of the product to remove
      const index = cart.products.indexOf(req.params.id); 
  
      if (index === -1) {
        return res.status(404).send("Product not found in cart");
      }
  
     
      cart.products.splice(index, 1);  
  
      
      const product = await productModel.findOne({ _id: req.params.id });
      if (product) {
        cart.totalPrices -= product.price; 
      }
  
      
      await cart.save();
  
      res.redirect("back");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  });
   




module.exports=router;