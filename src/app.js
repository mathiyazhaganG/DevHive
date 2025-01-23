const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require('./models/user.js');
const port = 3000;

app.use(express.json());

app.post("/signup", async (req, res) => {
    const newUser = new User(req.body);
    try {
        await newUser.save();
        res.status(201).json({ message: "User created" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(400).json({ message: error.message });
    }
});

app.get("/feed", async (req, res) => {
    const email = req.body.emailId;
    try {
        const users = await User.find({ emailId: email });
        res.status(200).json(users);
        console.log("User fetched");
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

app.delete("/user", async (req, res) => {
    const email = req.body.emailId;
    try {
        await User.deleteOne({ emailId: email });
        res.status(200).json({ message: "User deleted" });
        console.log("User deleted");
    } catch (error) {
        console.error("Unable to delete user:", error);
        res.status(500).json({ message: "Unable to delete user" });
    }
});

app.patch("/user/:emailId", async (req, res) => {
    const email = req.params.emailId;
    const data = req.body;
    try {
        const allowed_updates = ["firstName", "lastName", "password", "gender", "age", "skills"];
        const isupdated_allowed = Object.keys(data).every((k) => allowed_updates.includes(k));
        if (!isupdated_allowed) {
            throw new Error("Update not allowed");
        }
        const updatedUser = await User.findOneAndUpdate({ emailId: email }, data, {
            runValidators: true
        });
        res.status(200).json({ message: "User updated", updatedUser });
        console.log(updatedUser);
    } catch (error) {
        console.error("Unable to update the user:", error);
        res.status(500).json({ message: "Unable to update the user" });
    }
});

connectDB()
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
