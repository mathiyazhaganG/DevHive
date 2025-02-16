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
				return row.touserID;
			} else {
				return row.fromuserID;
			}
		});
		res.json({
			message:"connections fetched",
			data
		});
	} catch (error) {
		res.status(500).json({message:"Error fetching user connections",error});
	}
});
userRouter.get("/feed",authUser,async (req,res) => {
	try {
		const loggedinUser = req.user;
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const skip = (page - 1) * limit;
		
		const connections = await Connections.find({
			$or: [{fromuserID:loggedinUser._id},{touserID:loggedinUser._id}]
		}).select("fromuserID touserID");
		const hideusers=new Set();
		connections.forEach((req)=>{
			hideusers.add(req.fromuserID._id.toString());
			hideusers.add(req.touserID._id.toString());
		});
		
		const users = await User.find({
			$and:[
				{
					_id:{$nin:Array.from(hideusers)}
				},
				{
					_id:{$ne:loggedinUser._id}
				}
				
			]
		}).select("firstName lastName gender age skill photourl").skip(skip).limit(limit);

		res.json({
			message:"users fetched",
			data:users
		})

	} catch (error) {
		res.status(500).json({message:"Error fetching user feed",error});
		
	}
	
})

  

module.exports=userRouter;
