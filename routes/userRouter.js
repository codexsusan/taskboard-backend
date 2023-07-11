const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyUser } = require("../middlewares/verifyUser");

router.post("/register", verifyUser, userController.userSignUp);
router.post("/login", userController.userLogIn);

module.exports = router;
