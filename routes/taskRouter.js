const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const { verifyUser } = require("../middlewares/verifyUser");
const { boardMembership } = require("../middlewares/boardMembership");

router.post(
  "/board/:boardId/stage/:stageId/create",
  verifyUser,
  boardMembership,
  taskController.createTask
);

router.delete(
  "/board/:boardId/stage/:stageId/delete/:taskId",
  verifyUser,
  boardMembership,
  taskController.deleteTask
);

router.patch(
    "/board/:boardId/stage/:stageId/update/:taskId",
    verifyUser,
    boardMembership,
    taskController.updateTask
)

router.get(
    "/board/:boardId/stage/:stageId/view/:taskId",
    verifyUser,
    boardMembership,
    taskController.viewTask
)

router.get(
    "/board/:boardId/stage/:stageId/all",
    verifyUser,
    boardMembership,
    taskController.viewAllTasks
)

module.exports = router;
