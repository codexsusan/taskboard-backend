const { v4: uuidv4 } = require("uuid");
const {
  Task,
  Stage,
  User,
  Board,
  UserTask,
  BoardMember,
} = require("../models");

exports.createTask = async (req, res) => {
  const { stageId } = req.params;
  const { title, description, priority } = req.body;
  const userType = req.user.userType;
  try {
    const stage = await Stage.findByPk(stageId);
    console.log(stage);
    if (!stage)
      return res.json({
        message: "Stage not found.",
        success: false,
      });
    const task = await Task.create({
      id: uuidv4(),
      title,
      description,
      priority,
      commentsOrder: [],
      stageId,
      boardId: stage.boardId,
    });

    if (userType === "user") {
      await UserTask.create({
        userId: req.user.user.id,
        taskId: task.id,
      });
    }
    res.status(201).json({
      message: "Task created successfully.",
      success: true,
      data: task,
      stage,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.updateTask = async (req, res) => {
  const { stageId, taskId } = req.params;
  const { title, description, priority } = req.body;
  try {
    const stage = await Stage.findByPk(stageId);
    if (!stage)
      return res.json({
        message: "Stage not found.",
        success: false,
      });
    const task = await Task.findByPk(taskId);
    if (!task)
      return res.json({
        message: "Task not found.",
        success: false,
      });

    await Task.update(
      {
        title,
        description,
        priority,
      },
      { where: { id: taskId } }
    );

    res.status(200).json({
      message: "Task updated successfully.",
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.viewTask = async (req, res) => {
  const { stageId, taskId } = req.params;
  try {
    const stage = await Stage.findByPk(stageId);
    if (!stage)
      return res.json({
        message: "Stage not found.",
        success: false,
      });
    const task = await Task.findByPk(taskId, {
      attributes: { exclude: ["updatedAt"] },
    });
    if (!task)
      return res.json({
        message: "Task not found.",
        success: false,
      });
    res.status(200).json({
      message: "Task found.",
      success: true,
      data: task,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.viewAllTasks = async (req, res) => {
  const { stageId } = req.params;
  try {
    const stage = await Stage.findByPk(stageId);
    if (!stage)
      return res.json({
        message: "Stage not found.",
        success: false,
      });
    const tasks = await Task.findAll({
      where: { stageId },
      attributes: { exclude: ["updatedAt"] },
    });
    res.status(200).json({
      message: "Tasks found.",
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.assignTask = async (req, res) => {
  const { taskId, userId, boardId } = req.params;
  try {
    const board = await Board.findByPk(boardId);
    if (!board)
      return res.json({
        message: "Board not found.",
        success: false,
      });
    const task = await Task.findByPk(taskId);
    if (!task)
      return res.json({
        message: "Task not found.",
        success: false,
      });
    const user = await User.findByPk(userId);
    if (!user)
      return res.json({
        message: "User not found.",
        success: false,
      });
    const isBoardMember = await BoardMember.findOne({
      where: { userId, boardId },
    });
    if (!isBoardMember)
      return res.json({
        message: "User not board member.",
        success: false,
      });
    const isAlreadyAssigned = await UserTask.findOne({
      where: { userId, taskId },
    });
    if (isAlreadyAssigned)
      return res.json({
        message: "User already assigned.",
        success: false,
      });

    await UserTask.create({
      userId,
      taskId,
    });
    res.status(200).json({
      message: "Task assigned successfully.",
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.unassignTask = async (req, res) => {
  const { taskId, userId, boardId } = req.params;
  try {
    const board = await Board.findByPk(boardId);
    if (!board)
      return res.json({
        message: "Board not found.",
        success: false,
      });
    const task = await Task.findByPk(taskId);
    if (!task)
      return res.json({
        message: "Task not found.",
        success: false,
      });
    const user = await User.findByPk(userId);
    if (!user)
      return res.json({
        message: "User not found.",
        success: false,
      });
    const isBoardMember = await BoardMember.findOne({
      where: { userId, boardId },
    });
    if (!isBoardMember)
      return res.json({
        message: "User not board member.",
        success: false,
      });
    const isAssigned = await UserTask.findOne({
      where: { userId, taskId },
    });
    if (!isAssigned)
      return res.json({
        message: "User isn't assigned.",
        success: false,
      });
    await UserTask.destroy({ where: { userId, taskId } });
    res.status(200).json({
      message: "Task unassigned successfully.",
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.viewAllAssignedUsers = async (req, res) => {
  const { taskId, boardId } = req.params;
  try {
    const board = await Board.findByPk(boardId);
    if (!board)
      return res.json({
        message: "Board not found.",
        success: false,
      });
    const task = await Task.findByPk(taskId);
    if (!task)
      return res.json({
        message: "Task not found.",
        success: false,
      });
    const assignedUsers = await UserTask.findAll({
      where: { taskId },
      attributes: { exclude: ["updatedAt", "createdAt", "id"] },
    });
    let users = [];
    for (let i = 0; i < assignedUsers.length; i++) {
      const assignedUser = assignedUsers[i];
      const user = await User.findOne({
        where: { id: assignedUser.userId },
        attributes: {
          exclude: ["updatedAt", "createdAt", "password", "orgId"],
        },
      });
      console.log(assignedUser.userId);
      console.log(user.id);
      users = [...users, user];
    }
    res.status(200).json({
      message: "Assigned users found.",
      success: true,
      data: users,
      assignedUsersCount: assignedUsers.length,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.deleteTask = async (req, res) => {
  const { stageId, taskId } = req.params;
  try {
    const stage = await Stage.findByPk(stageId);
    if (!stage)
      return res.json({
        message: "Stage not found.",
        success: false,
      });
    await Task.destroy({ where: { id: taskId } });
    res.status(200).json({
      message: "Task deleted successfully.",
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.viewAllTasksInOrg = async (req, res) => {
  const orgId = req.orgId;
  try {
  const boards = await Board.findAll({
    where: { orgId },
  });
  const boardIds = boards.map((board) => board.id);
  const stages = await Stage.findAll({
    where: { boardId: boardIds },
  });
  const stageIds = stages.map((stage) => stage.id);
  let tasks = [];
  for (let i = 0; i < stageIds.length; i++) {
    const stageId = stageIds[i];
    const stageTasks = await Task.findAll({
      where: { stageId },
      attributes: { exclude: ["updatedAt"] },
    });
    tasks = [...tasks, ...stageTasks];
  }
  res.status(200).json({
    message: "Tasks found.",
    success: true,
    data: tasks,
    // data: orgId,
    tasksCount: tasks.length,
  });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.updateStage = async (req, res) => {
  const { taskId, srcStageId, destStageId } = req.params;
  try {
    const task = await Task.findByPk(taskId);
    if (!task)
      return res.json({
        message: "Task not found.",
        success: false,
      });
    const srcStage = await Stage.findByPk(srcStageId);
    if (!srcStage)
      return res.json({
        message: "Source stage not found.",
        success: false,
      });
    const destStage = await Stage.findByPk(destStageId);
    if (!destStage)
      return res.json({
        message: "Destination stage not found.",
        success: false,
      });
    const updatedTask = await Task.update(
      {
        stageId: destStageId,
      },
      { where: { id: taskId } }
    );
    res.status(200).json({
      message: "Task updated successfully.",
      success: true,
      task: updatedTask,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};
