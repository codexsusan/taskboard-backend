const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const { verifyUser } = require("../middlewares/verifyUser");
const { boardMembership } = require("../middlewares/boardMembership");
const { onlyOrgAccess } = require("../middlewares/onlyOrgAccess");
const { checkTaskAssigned } = require("../middlewares/checkTaskAssigned");

router.post(
  "/board/:boardId/stage/:stageId/create",
  verifyUser,
  boardMembership,
  taskController.createTask
);

router.delete(
  "/board/:boardId/stage/:stageId/delete/:taskId",
  verifyUser,
  checkTaskAssigned,
  taskController.deleteTask
);

router.patch(
  "/board/:boardId/stage/:stageId/update/:taskId",
  verifyUser,
  checkTaskAssigned,
  taskController.updateTask
);

router.get(
  "/board/:boardId/stage/:stageId/view/:taskId",
  verifyUser,
  boardMembership,
  taskController.viewTask
);

router.get(
  "/board/:boardId/stage/:stageId/all",
  verifyUser,
  boardMembership,
  taskController.viewAllTasks
);

router.patch(
  "/board/:boardId/:taskId/assign/:userId",
  verifyUser,
  onlyOrgAccess,
  taskController.assignTask
);

router.patch(
  "/board/:boardId/:taskId/unassign/:userId",
  verifyUser,
  onlyOrgAccess,
  taskController.unassignTask
);

module.exports = router;
