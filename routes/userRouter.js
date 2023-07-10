const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { fetchUser } = require("../middlewares/tokenMiddleware");

router.post("/register", fetchUser, userController.userSignUp);
router.post("/login", userController.userLogIn);

module.exports = router;
