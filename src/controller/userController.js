const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/userModel");

const registerUser = async (req, res, next) => {
  try {
    const { fullname, username, email, password } = req.body;

    const newEmail = email.toLowerCase().trim();
    const newUsername = username.toLowerCase().trim();

    // check existing email
    const existingEmail = await User.findOne({ email: newEmail });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // check existing username
    const existingUsername = await User.findOne({ username: newUsername });
    if (existingUsername) {
      return res.status(400).json({ message: "This username has been taken" });
    }

    // generate salt & hash password
    const salt = await bcrypt.genSalt(13);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Extract avatar path/URL if uploaded during registration
    const avatar = req.file ? req.file.path : "";

    // create user
    const newUser = new User({
      fullname: fullname.trim(),
      username: newUsername,
      email: newEmail,
      password: hashedPassword,
      avatar,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Account created successfully",
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const loginEmail = email.toLowerCase().trim();

    // find user
    const existingUser = await User.findOne({ email: loginEmail });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: existingUser._id,
        username: existingUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: existingUser._id,
        fullname: existingUser.fullname,
        username: existingUser.username,
        email: existingUser.email,
        avatar: existingUser.avatar || "",
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

// Update profile avatar for authenticated users
const uploadAvatarController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image file." });
    }

    // req.user comes from your authentication middleware
    const userId = req.user._id || req.user.userId;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: req.file.path }, // Cloudinary URL or file path from Multer
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Avatar uploaded successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    // req.user comes from your authentication middleware
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User profile fetched",
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        avatar: user.avatar || "" // Returns Cloudinary or local image path
      }
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  registerUser,
  loginUser,
  uploadAvatarController,
  getUserProfile
};