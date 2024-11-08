const jwt=require('jsonwebtoken');
const passport = require('passport');

require('dotenv').config;

async function validateAdmin(req,res,next){
    try{
      let token=req.cookies.token;
  
      if(!token) return res.send("you need to login first");
      let data= await jwt.verify(token,process.env.JWT_SECRET);
      req.user=data;
      
      next();
    }
    catch(err){
        res.send(err.message);
    }
}

async function isUserLoggedin(req,res,next){
    if (req.isAuthenticated()) return next();
    res.redirect("/user/login");
}

module.exports={validateAdmin,isUserLoggedin}