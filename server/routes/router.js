const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
  profileController,
  messagesController,
  peopleController,
} = require("../controllers/userControllers");

//router abject
const router = new express.Router();

// user routes
//POST  || registration
router.post("/register", registerController);

//POST  || login
router.post("/login", loginController);

// POST || logout
router.post("/logout", logoutController);

//GET || Get Profile
router.get("/profile", profileController);

//GET || Get Profile
router.get("/people", peopleController);

//GET || Get Messages
router.get("/messages/:userId", messagesController);

module.exports = router;
