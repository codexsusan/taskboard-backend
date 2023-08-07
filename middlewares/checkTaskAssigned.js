const { Task, UserTask } = require("../models");
exports.checkTaskAssigned = async (req, res, next) => {
  const { taskId } = req.params;
  const userType = req.user.userType;
  try {
    const task = await Task.findByPk(taskId);
    if (!task)
      return res.json({
        message: "Task not found.",
        success: false,
      });

    if (userType === "org") {
      req.task = task;
      return next();
    }
    if (userType === "user") {
      const userId = req.user.user.id;
      const userTask = await UserTask.findOne({
        where: { userId, taskId },
      });
      if (!userTask)
        return res.json({
          message: "User hasn't been assigned this task.",
          success: false,
        });
      req.task = task;
      return next();
    }
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};
