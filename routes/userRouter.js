const express=require('express');
const router=express.Router();

router.get("/login", function(req, res) {
    res.render("user_login");
});

router.get("/logout", function(req, res, next) {
    req.logout(function(err) {
        if (err) { 
            return next(err);  // Handle logout error
        }
        
        // After logout, destroy the session
        req.session.destroy((err) => {
            if (err) {
                return res.send(err);  // Handle session destruction error
            }

            // Clear the cookie after session is destroyed
            res.clearCookie("connect.sid");
            
            // Redirect to login page after successful logout
            res.redirect("/user/login");
        });
    });
});

module.exports = router;



