const express = require("express");

const upload = require("../middleware/uploadMiddleware");


const { 
    registerValidation, 
    loginValidation 
} = require("../validation/userValidation");

const { 
    registerUser, 
    loginUser,
    uploadAvatarController,
    getUserProfile
} = require("../controller/userController");

const route = express.Router();




route.get("/profile", getUserProfile);

// Register
route.post("/register", upload.single("avatar"), registerValidation, registerUser);


// Login route
route.post("/login", loginValidation, loginUser);

// Route to update avatar for an existing logged-in user
route.patch("/avatar", upload.single("avatar"), uploadAvatarController);


module.exports = route;