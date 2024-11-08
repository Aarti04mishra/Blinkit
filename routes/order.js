const express=require('express');
const router=express.Router();
const {paymentModel}=require('../models/paymentModel')
const {orderModel}=require('../models/orderModel')

router.get("/:userid/:orderid/:paymentid/:signature",async function(req,res){
  let paymentDetails=await paymentModel.findOne({orderId:req.params.orderId,status:"pending"});

  if(!paymentDetails) return res.send("Sorry,this order does not exist");


  if(req.params.signature===paymentDetails.signature && req.params.paymentid===paymentDetails.paymentId){
   let cart=await cartModel.findOne({user:req.params.userid});

    await orderModel.create({
      orderId:req.params.orderid,
      user:req.params.userid,
      products:cart.products,
      totalPrice:cart.totalPrice,
      status:"processing",
      payment:paymentDetails._id,
    });
    res.redirect(`/map/${req.params.orderid}`)
  }
  else{
    res.send("invalid payment");
  }
})

router.post("/address/:orderid",async function(req,res){
  let order=await orderModel.findOne({orderId:req.params.orderid});
  if(!order) return res.send("sorry,this order does not exist");
  if(!req.body.address) return res.send("You must provide an address")
  order.address=req.body.address;
  await order.save()
  res.redirect("/");
})



module.exports=router;