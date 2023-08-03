const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const { verifyUser } = require("../middlewares/verifyUser");
const { boardMembership } = require("../middlewares/boardMembership");
const { onlyOrgAccess } = require("../middlewares/onlyOrgAccess");

// Create a board
router.post("/create", verifyUser, boardController.createBoard);

// Get a board detail
router.get(
  "/view/:boardId",
  verifyUser,
  boardMembership,
  boardController.getBoard
);

// Update a board
router.patch(
  "/update/:boardId",
  verifyUser,
  boardMembership,
  boardController.updateBoard
);
// Delete a board
router.delete(
  "/:boardId",
  verifyUser,
  boardMembership,
  boardController.deleteBoard
);

// Get all board of an organization
router.get("/org/all", verifyUser,  boardController.getAllBoards);

// Add a member to a board
router.post(
  "/:boardId/add-member",
  verifyUser,
  onlyOrgAccess,
  boardController.addMember
);

router.delete(
  "/:boardId/remove-member/:userId",
  verifyUser,
  onlyOrgAccess,
  boardController.removeMember
);

module.exports = router;
