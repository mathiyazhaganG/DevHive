const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async (req, res, next) => {
    try {
        console.log("Cookies:", req.cookies); // Debug log
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Please login first! No token found." });
        }

        console.log("Token received:", token);

        const decodedObj = jwt.verify(token, "mathi@!54");
        console.log("Decoded Token:", decodedObj);

        const { _id } = decodedObj;
        const user = await User.findById(_id);

        if (!user) {
            return res.status(401).json({ message: "User not found in database" });
        }

        req.user = user;
        console.log("Authenticated User:", req.user); // Debugging log
        next();
    } catch (err) {
        console.error("Authentication failed:", err.message);
        res.status(400).json({ message: "Authentication failed", error: err.message });
    }
};

module.exports = authUser;
