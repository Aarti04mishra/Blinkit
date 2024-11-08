const express=require('express');
const path=require('path');
const app=express();
const indexRouter=require("./routes/indexRouter");
const authRouter=require("./routes/auth");
const adminRouter=require("./routes/admin");
const productRouter=require("./routes/productsRouter")
const categoryRouter=require("./routes/categoriesRouter");
const userRouter=require("./routes/userRouter")
const cartRouter=require("./routes/cartRouter");
const paymentRouter=require("./routes/payment");
const orderRouter=require("./routes/order")

const session=require("express-session");
const cookieParser=require('cookie-parser');
const passport = require('passport');


require('dotenv').config();
require("./config/google-oauth-config");
require('./config/db')

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  }));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use("/",indexRouter);
app.use("/auth",authRouter);
app.use("/admin",adminRouter);
app.use("/products",productRouter);
app.use("/categories",categoryRouter)
app.use("/user",userRouter);
app.use("/cart",cartRouter);
app.use("/payment",paymentRouter);
app.use("/order",orderRouter);

app.listen(3000);