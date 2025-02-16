const express = require('express');
const profilerouter = express.Router();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authUser= require('../middlewares/authadmin.js')
const {ProfileEditValidator}=require('../utils/validatior.js')

profilerouter.get("/profile", async (req, res) => {
	const token = req.cookies.token;
	const decoded = jwt.verify(token, 'mathi@!54');
	const user = await User.findOne({ emailId: decoded.emailId });
	if (!user) return res.status(401).json({ message: "Invalid token" });
	res.status(200).json(user);
// //   if(decoded.length>0){
//     console.log(decoded);
//     res.send(decoded);
//     res.send("user verified")
//   }else{
//     res.send("user not verified")
//     console.log(decoded);
//   }
	


});

profilerouter.patch("/profile/edit",authUser,async (req, res) => {
  
    try {
		if(!ProfileEditValidator(req)){
			throw new Error("inavlid update request");
			
		}
		const loggedInUser= req.user;
		Object.keys(req.body).forEach((key)=>loggedInUser[key]=req.body[key]);
		 await loggedInUser.save();
         res.status(200).json(loggedInUser);
      
     
    } catch (error) {
        console.error("Unable to update the user:", error);
        res.status(500).json({ message: "Unable to update the user" });
    }
});

profilerouter.delete("/user", async (req, res) => {
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



profilerouter.post("/password/edit", authUser, async (req, res) => {
    try {
        const { current_password, new_password, confirm_password } = req.body;
        const { password } = req.user;

      
        const pass = await bcrypt.compare(current_password, password);
        if (!pass) {
            return res.status(400).json({ message: "Invalid current password" });
        }

        if (new_password !== confirm_password) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        req.user.password = await bcrypt.hash(new_password, 10);
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ message: "Something went wrong", error: error.message });
    }
});

module.exports = profilerouter;