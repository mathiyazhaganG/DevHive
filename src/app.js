import express from 'express';
const app= express();
const port = 3000;

app.use("/",(req,res)=>{
    res.send("Hello World");
})

app.listen(3000,()=>{
console.log(`server is running in ${port}`)})