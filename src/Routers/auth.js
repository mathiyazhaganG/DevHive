const express = require('express');
const authrouter= express.Router();
const User = require('../models/user.js');
const {loginValidator} = require('../utils/validatior.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

authrouter.post("/signup", async (req, res) => {

	try {
		loginValidator(req);
		const { firstName, lastName, emailId, password, age, gender } = req.body;
		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({
			firstName,
			lastName,
			emailId,
			age,
			gender,
			password: hashedPassword
		});
		await newUser.save();
		res.status(201).json({ message: "User created" });
	} catch (error) {
		console.error("Error creating user:", error);
		res.status(400).json({ message: error.message });
	}
});

authrouter.post("/signin", async (req, res) => {
	const { emailId, password } = req.body;
	// const cookies = req.cookies;
	// // console.log(cookies)


	try {
		const user = await User.findOne({ emailId });
		if (!user) return res.status(401).json({ message: "Invalid email or password" })
		else if (user) {
			const match = await bcrypt.compare(password, user.password)

			if (!match) return res.status(401).json({ message: "Invalid email or password" })
			else {
				const token= await jwt.sign({emailId:user.emailId,_id:user._id},'mathi@!54');
				res.cookie("token",token);
				console.log(token);
				

					res.status(200).json({ message: "User logged in successfully" })

			}

		}



	} catch (error) {
		console.error("Error creating user:", error);
		res.status(400).json({ message: error.message });

	}
})

authrouter.post("/logout",async(req,res)=>{
	res.cookie("token",null,{expires:new Date(0)});
	res.status(200).json({message:"logged out succesfully "});
})

module.exports = authrouter;