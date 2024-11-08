var GoogleStrategy = require('passport-google-oauth20').Strategy;
const { userModel } = require('../models/userModel');  
const passport=require('passport')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.NODE_ENV === 'production' 
                ? process.env.GOOGLE_CALLBACK_URL_PROD 
                : process.env.GOOGLE_CALLBACK_URL_DEV
},
async function(accessToken, refreshToken, profile, cb) {
  try {
    let user = await userModel.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new userModel({
        name: profile.displayName,
        email: profile.emails[0].value
      });
      await user.save();
    }
    cb(null, user);
  } catch (err) {
    cb(err, false);
  }
}
));


passport.serializeUser(function(user,cb){    //user ki id ka data session me store ho jaayegi
     return cb(null,user._id);
});

passport.deserializeUser(async function(id,cb){    //user ke session ka data disclose ho jaayega
   let user=await userModel.findOne({_id:id});
  cb(null,user);
});

module.exports=passport;