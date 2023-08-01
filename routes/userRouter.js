const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyUser } = require("../middlewares/verifyUser");
const { onlyUserAccess } = require("../middlewares/onlyUserAccess");
const { onlyOrgAccess } = require("../middlewares/onlyOrgAccess");
const { boardMembership } = require("../middlewares/boardMembership");
const { User } = require("../models");

// Add user to an organization
router.post("/register", verifyUser, userController.userSignUp);

// User login
router.post("/login", userController.userLogIn);

// Update user data
router.patch(
  "/update/basic",
  verifyUser,
  onlyUserAccess,
  userController.updateBasicInfo
);

// Update user credentials
router.patch(
  "/update/credentials",
  verifyUser,
  onlyUserAccess,
  userController.updateCredentials
);

// Get user data
router.get("/view/:userId", verifyUser, userController.getUser);

// Get all users from the organization paginated data
router.get("/org/all", verifyUser, userController.getAllUsersPaginated);

// Get all users from the organization
router.get(
  "/org/allusers",
  verifyUser,
  // onlyOrgAccess,
  userController.getAllUsersInOrg
);

// Get all board members
router.get(
  "/all/board/:boardId",
  verifyUser,
  boardMembership,
  userController.getAllUsersInBoard
);

// Delete a user
router.delete("/delete/:userId", verifyUser, userController.deleteUser);

module.exports = router;
