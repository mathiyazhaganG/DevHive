const validator = require('validator');

const loginValidator=(req)=>{
	const{firstName,lastName,emailId,password}=req.body;
	if(!firstName || !lastName || !emailId || !password){
		throw new Error("enter all fields"+err.message);
	}
	else if(firstName.length<4&&lastName.length<4){
		throw new Error("first name and last name should be more than 4 characters");
	}
	else if(!validator.isEmail(emailId)){
		throw new Error("invalid email");
	}
	else if(!validator.isStrongPassword(password)){
		throw new Error("password should be strong");
	}
	
}

const ProfileEditValidator=(req)=>{
	  const allowed_updates = ["firstName", "lastName", "password", "gender", "age", "skills","photourl"];
			const isupdated_allowed = Object.keys(req.body).every((k) => allowed_updates.includes(k));
				return isupdated_allowed;
			
}

module.exports={loginValidator,ProfileEditValidator};