const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const { verifyUser } = require("../middlewares/verifyUser");
const { checkMembership } = require("../middlewares/checkMembership");
const { onlyOrgAccess } = require("../middlewares/onlyOrgAccess");

router.post("/create", verifyUser, boardController.createBoard);
router.get(
  "/view/:boardId",
  verifyUser,
  checkMembership,
  boardController.getBoard
);
router.patch(
  "/:boardId",
  verifyUser,
  checkMembership,
  boardController.updateBoard
);
router.delete(
  "/:boardId",
  verifyUser,
  checkMembership,
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
