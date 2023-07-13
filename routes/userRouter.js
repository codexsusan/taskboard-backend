const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyUser } = require("../middlewares/verifyUser");
const { onlyUserAccess } = require("../middlewares/onlyUserAccess");
const { onlyOrgAccess } = require("../middlewares/onlyOrgAccess");
const { boardMembership } = require("../middlewares/boardMembership");
const { User } = require("../models");

router.post("/register", verifyUser, userController.userSignUp);

router.post("/login", userController.userLogIn);

router.patch(
  "/update/basic",
  verifyUser,
  onlyUserAccess,
  userController.updateBasicInfo
);

router.patch(
  "/update/credentials",
  verifyUser,
  onlyUserAccess,
  userController.updateCredentials
);

router.get("/view/:userId", verifyUser, userController.getUser);

router.get(
  "/org/all",
  verifyUser,
  onlyOrgAccess,
  userController.getAllUsers
);

router.get(
  "/all/board/:boardId",
  verifyUser,
  boardMembership,
  userController.getAllUsersInBoard
);

router.delete("/delete/:userId", verifyUser, userController.deleteUser);

module.exports = router;
