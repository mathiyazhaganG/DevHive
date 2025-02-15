const authUser= require('../middlewares/authadmin.js');
const express = require('express');
const userRouter = express.Router();
const User = require('../models/user.js');
const Connections= require('../models/connectionRequest.js');
const mongoose =require('mongoose');

userRouter.get("/user/requests",authUser,async (req,res) => {
	try {
		const loggedinUser = req.user;
		const user = await Connections.find({
			touserID:loggedinUser._id,
			reqStatus:"interested"
		}).populate("fromuserID","firstName lastName");
		if(!user){
			return res.status(404).json({message:"No request found"});
		}
		res.json({
			message:"request fetched succesfully",
			data:user
		});
	} catch (error) {
		res.status(500).json({message:"Error fetching user requests",error});
		
	}
	
});

userRouter.get("/user/connections",authUser,async (req,res) => {
	try {
		const loggedinUser = req.user;
		const connections = await Connections.find({
			$or: [{fromuserID:loggedinUser._id},{touserID:loggedinUser._id}],
			reqStatus:"accepted"
			
		}).populate("fromuserID","firstName lastName gender age skill photourl").populate("touserID","firstName lastName gender age skill photourl");
		if(!connections){
			return res.status(404).json({message:"No connections found"});
		}
		const data = connections.map((row) => {
			if(row.fromuserID._id == loggedinUser._id){
				return row.touserID;}
				else{
					return row.fromuserID;}
					});
		res.json({
			message:"connections fetched",
			data
		})
	} catch (error) {
		res.status(500).json({message:"Error fetching user connections",error});
		
	}
	
})

module.exports=userRouter;

