const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://aartimishra:asdfrgthyfrgxdef@cluster0.t5pow.mongodb.net/mykhatabook?retryWrites=true&w=majority').then(function(){
    console.log("connected to mongodb");
});

module.exports=mongoose.connection;