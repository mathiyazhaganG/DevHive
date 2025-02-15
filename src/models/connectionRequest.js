const mongoose = require('mongoose');
const connectionSchema = new mongoose.Schema({
	
	fromuserID:{
		type:mongoose.Types.ObjectId,
		ref:'User',
		required:true
	},
	touserID:{
		type:mongoose.Types.ObjectId,
		required:true
	},
	reqStatus:{
		type:String,
		required:true,
		enum:{
			values:["interested","ignore","accepted","rejected"],
			message:"reqStatus must be either interested or ignore"
		}
	}
	
	
	
},{timestamps:true});
module.exports=mongoose.model('Connections',connectionSchema);