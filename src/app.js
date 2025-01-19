const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require('./models/user.js')
const port = 3000;

app.post("/signup", async (req, res) => {
    const newUser= new User({
        firstName: "mathi",
        lastName: "azhagan",
        emailId: "mathi@hjh.com",
        password: "mathi123"
    })
    
    
    try {
        await newUser.save();
        res.send("user created");

    } catch (error) {
        console.err("something went wrong");

    }
});


connectDB()
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(3000, () => {
            console.log(`server is running in ${port}`)
        })

    })
    .catch((err) => {
        console.log("Error connecting to MongoDB");
    })

