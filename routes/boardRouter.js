const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const { verifyUser } = require("../middlewares/verifyUser");
const { boardMembership } = require("../middlewares/boardMembership");
const { onlyOrgAccess } = require("../middlewares/onlyOrgAccess");

router.post("/create", verifyUser, boardController.createBoard);
router.get(
  "/view/:boardId",
  verifyUser,
  boardMembership,
  boardController.getBoard
);
router.patch(
  "/:boardId",
  verifyUser,
  boardMembership,
  boardController.updateBoard
);
router.delete(
  "/:boardId",
  verifyUser,
  boardMembership,
  boardController.deleteBoard
);

router.get("/all", verifyUser, onlyOrgAccess, boardController.getAllBoards);

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
