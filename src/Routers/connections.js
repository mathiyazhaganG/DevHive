const authUser= require('../middlewares/authadmin.js');
const express = require('express');
const connectionRouter = express.Router();
const User = require('../models/user.js');
const Connections= require('../models/connectionRequest.js');
const mongoose =require('mongoose');


connectionRouter.post("/requests/send/:status/:userId",authUser,async (req,res) => {
	try {
		const fromuserID = req.user._id;
		const touserID = req.params.userId;
		const status = req.params.status;
		const allowed_status=["ignored","interested"];
		if(!allowed_status.includes(status)){
			return res.status(400).json({message:"Invalid status"});
			
		}
		const touser = await User.findById(touserID);
		if(!touser){
			return res.status(404).json({
				message:"User not found"
			})
		}
		
		const existingConnectionreq = await Connections.findOne({
		 $or:[
			{fromuserID,touserID},
			{fromuserID:touserID,touserID:fromuserID},
		 ]	
		});
		if(existingConnectionreq){
			return res.status(400).json({message:"Connection request already exists"});
		}
		if(fromuserID&&touserID == fromuserID){
			return res.status(400).json({message:"You can't send connection request to yourself"})
		};
			
		
		const connectionRequest= new Connections({
			 fromuserID,
			 touserID,
			 reqStatus:status
		});
		const result = await connectionRequest.save();
		res.json({
			message:"connection request sent successfully",
			result
		});
			
	} catch (error) {
		res.status(500).json({message:error.message});
		
	}
});
connectionRouter.post("/requests/review/:status/:userId",authUser,async (req,res) =>{
	try {
		
		const loggedinUser=req.user;
		const{status,userId}=req.params;
		const allowed_status=["accepted","rejected"];
		if(!allowed_status.includes(status)){
			return res.status(400).json({message:"Invalid status"});
		}
		const request = await Connections.findOne({
			_id:userId,
			touserID:loggedinUser._id,
			reqStatus:"interested"
		});
		if(!request){
			return res.status(400).json({message:"request not found"})
		}
		request.reqStatus=status;
		const result = await request.save();
		res.json({message:"request sucessfully reviewed",
			result})
	} catch (error) {
		res.status(500).json({message:error.message});
		
	}
} )








module.exports=connectionRouter;
