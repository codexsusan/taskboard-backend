const { Task } = require("../models");
exports.checkTaskAssigned = async (req, res, next) => {
  const { taskId } = req.params;
  const userType = req.user.userType;
  try {
    const task = await Task.findByPk(taskId);
    if (!task)
      return res.status(404).json({
        message: "Task not found.",
        success: false,
      });

    if (userType === "org") {
      req.task = task;
      return next();
    }
    if (userType === "user") {
      const userId = req.user.user.id;
      if (task.assignedTo.includes(userId)) {
        req.task = task;
        return next();
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};
