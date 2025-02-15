const mongoose = require('mongoose');
const validator = require('validator');
const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [3, 'First name must be at least 3 characters long'],
        maxlength: [50, 'First name must be at most 50 characters long']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        default: "N/A"
    },
    emailId: {
        type: String,
        required: [true, 'Email ID is required'],
        unique: true,
        trim: true,
        lowercase: true,
		validate(value){
			if(!validator.isEmail(value)){
				throw new Error('Invalid email');
		}}
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [4, 'Password must be at least 4 characters long'],
        maxlength: [100, 'Password must be at most 100 characters long']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        validate(value) {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error("Gender is not valid");
            }
        }
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [18, 'Age must be at least 18'],
        max: [100, 'Age must be at most 100']
    },
    skills: {
        type: Array,
        default: []
    },
    Photourl:{
        type:String
    }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
