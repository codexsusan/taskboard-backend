const express = require("express");
const router = express.Router();

const stageController = require("../controllers/stageController");
const { verifyUser } = require("../middlewares/verifyUser");
const { boardMembership } = require("../middlewares/boardMembership");

// Create a stage
router.post(
  "/board/:boardId/create",
  verifyUser,
  boardMembership,
  stageController.createStage
);

// Delete a stage
router.delete(
  "/board/:boardId/delete/:stageId",
  verifyUser,
  boardMembership,
  stageController.deleteStage
);

// Update a stage
router.patch(
    "/board/:boardId/update/:stageId",
    verifyUser,
    boardMembership,
    stageController.updateStage
)

// Get single stage
router.get(
  "/board/:boardId/stage/:stageId",
  verifyUser,
  boardMembership,
  stageController.viewStage
)

// Get all stages of a board 
router.get(
  "/board/:boardId/stages/all",
  verifyUser,
  boardMembership,
  stageController.viewAllStages
)

module.exports = router;
