const express = require("express");
const connectDB = require("./config/database.js");
const app = express();
const User = require('./models/user.js');
const loginValidator = require('./utils/validatior.js');
const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const port = 3000;

app.use(express.json());
app.use(cookieparser());

const authrouter = require('./Routers/auth.js');
const profilerouter = require('./Routers/profile.js');

app.use('/',profilerouter);
app.use('/',authrouter);














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
