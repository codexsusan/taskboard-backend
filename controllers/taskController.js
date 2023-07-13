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
    if (!stage)
      return res.status(404).json({
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
    });
  } catch (error) {
    res.status(500).json({
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
      return res.status(404).json({
        message: "Stage not found.",
        success: false,
      });
    const task = await Task.findByPk(taskId);
    if (!task)
      return res.status(404).json({
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
    res.status(500).json({
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
      return res.status(404).json({
        message: "Stage not found.",
        success: false,
      });
    const task = await Task.findByPk(taskId, {
      attributes: { exclude: ["updatedAt"] },
    });
    if (!task)
      return res.status(404).json({
        message: "Task not found.",
        success: false,
      });
    res.status(200).json({
      message: "Task found.",
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
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
      return res.status(404).json({
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
    res.status(500).json({
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
      return res.status(404).json({
        message: "Board not found.",
        success: false,
      });
    const task = await Task.findByPk(taskId);
    if (!task)
      return res.status(404).json({
        message: "Task not found.",
        success: false,
      });
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    const isBoardMember = await BoardMember.findOne({
      where: { userId, boardId },
    });
    if (!isBoardMember)
      return res.status(401).json({
        message: "User not board member.",
        success: false,
      });
    const isAlreadyAssigned = await UserTask.findOne({
      where: { userId, taskId },
    });
    if (isAlreadyAssigned)
      return res.status(409).json({
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
    res.status(500).json({
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
      return res.status(404).json({
        message: "Board not found.",
        success: false,
      });
    const task = await Task.findByPk(taskId);
    if (!task)
      return res.status(404).json({
        message: "Task not found.",
        success: false,
      });
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    const isBoardMember = await BoardMember.findOne({
      where: { userId, boardId },
    });
    if (!isBoardMember)
      return res.status(401).json({
        message: "User not board member.",
        success: false,
      });
    const isAssigned = await UserTask.findOne({
      where: { userId, taskId },
    });
    if (!isAssigned)
      return res.status(409).json({
        message: "User isn't assigned.",
        success: false,
      });
    await UserTask.destroy({ where: { userId, taskId } });
    res.status(200).json({
      message: "Task unassigned successfully.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
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
      return res.status(404).json({
        message: "Stage not found.",
        success: false,
      });
    await Task.destroy({ where: { id: taskId } });
    res.status(200).json({
      message: "Task deleted successfully.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
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
      dataLength: tasks.length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};
