const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");
const { verifyUser } = require("../middlewares/verifyUser");
const { boardMembership } = require("../middlewares/boardMembership");
const { onlyOrgAccess } = require("../middlewares/onlyOrgAccess");
const { checkTaskAssigned } = require("../middlewares/checkTaskAssigned");

// Create a task
router.post(
  "/board/:boardId/stage/:stageId/create",
  verifyUser,
  boardMembership,
  taskController.createTask
);

// Delete a task
router.delete(
  "/board/:boardId/stage/:stageId/delete/:taskId",
  verifyUser,
  checkTaskAssigned,
  taskController.deleteTask
);

// Update a task
router.patch(
  "/board/:boardId/stage/:stageId/update/:taskId",
  verifyUser,
  checkTaskAssigned,
  taskController.updateTask
);

// Get a task
router.get(
  "/board/:boardId/stage/:stageId/view/:taskId",
  verifyUser,
  boardMembership,
  taskController.viewTask
);

// Get all tasks in a stage
router.get(
  "/board/:boardId/stage/:stageId/all",
  verifyUser,
  boardMembership,
  taskController.viewAllTasks
);

// Assign a task to user
router.patch(
  "/board/:boardId/:taskId/assign/:userId",
  verifyUser,
  onlyOrgAccess,
  taskController.assignTask
);

// Unassign a task from user
router.patch(
  "/board/:boardId/:taskId/unassign/:userId",
  verifyUser,
  onlyOrgAccess,
  taskController.unassignTask
);

// Get all task of an organization
router.get("/org/allTasks", verifyUser, taskController.viewAllTasksInOrg);


module.exports = router;
