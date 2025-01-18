const express = require("express");
const { authdmin } = require("./middlewares/authadmin");




const app= express();
const port = 3000;

app.get("/admin",authdmin, (req, res) => {
    res.send("Welcome to admin page");
})

app.use("/",(err,req,res,next)=>{
    if(err){
        res.status(500).send("something went wrong")
    }
})

app.listen(3000,()=>{
console.log(`server is running in ${port}`)})