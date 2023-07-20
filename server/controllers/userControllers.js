const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const Message = require("../models/messageSchema");

const getUserDataFromRequest = async (req) => {
  const token = req.cookies?.token;

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(new Error("Invalid token"));
          return;
        }
        resolve(decoded);
      });
    });

    return decoded;
  } catch (err) {
    throw err;
  }
};

// Register Controller
const registerController = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const createdUser = await User.create({
      username: username,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { userId: createdUser._id, username },
      process.env.JWT_SECRET
    );
    res
      .cookie("token", token, { sameSite: "none", secure: true })
      .status(201)
      .json({
        id: createdUser._id,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json("error");
  }
};

// Login Controller
const loginController = async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });

  if (foundUser && bcrypt.compareSync(password, foundUser.password)) {
    const token = jwt.sign(
      { userId: foundUser._id, username },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, { sameSite: "none", secure: true }).json({
      id: foundUser._id,
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
};

// Logout Controller
const logoutController = async (req, res) => {
  try {
    res
      .cookie("token", "", { sameSite: "none", secure: true })
      .json("Logout successful");
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Profile Controller
const profileController = async (req, res) => {
  const token = req.cookies?.token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
      if (err) throw err;
      res.json(userData);
    });
  } else {
    res.status(401).json("no token");
  }
};

//People Controller
const peopleController = async (req, res) => {
  const users = await User.find({}, "_id username");
  res.json(users);
};

// Get Messages Controller
const messagesController = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await getUserDataFromRequest(req);
    const ourUserId = userData.userId;

    const messages = await Message.find({
      sender: { $in: [userId, ourUserId] },
      recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    if (err.message === "No token found") {
      return res.status(401).json("No token found");
    }
    return res.status(500).json("Error retrieving messages");
  }
};

module.exports = {
  registerController,
  loginController,
  logoutController,
  peopleController,
  profileController,
  messagesController,
};
