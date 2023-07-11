const express = require("express");
const router = express.Router();

const stageController = require("../controllers/stageController");
const { verifyUser } = require("../middlewares/verifyUser");
const { boardMembership } = require("../middlewares/boardMembership");

router.post(
  "/board/:boardId/create",
  verifyUser,
  boardMembership,
  stageController.createStage
);

router.delete(
  "/board/:boardId/delete/:stageId",
  verifyUser,
  boardMembership,
  stageController.deleteStage
);

router.patch(
    "/board/:boardId/update/:stageId",
    verifyUser,
    boardMembership,
    stageController.updateStage
)

module.exports = router;
