const { v4: uuidv4 } = require("uuid");
const { Task, Stage, User, Board } = require("../models");

exports.createTask = async (req, res) => {
  const { stageId } = req.params;
  const { title, description, priority } = req.body;
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
      stageId,
      commentsOrder: [],
      assignedTo: [],
    });
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
    if (!board.assignedMembers.includes(userId))
      return res.status(401).json({
        message: "User not board member.",
        success: false,
      });
    if (task.assignedTo.includes(userId))
      return res.status(409).json({
        message: "User already assigned.",
        success: false,
      });
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    await Task.update(
      {
        assignedTo: [...task.assignedTo, userId],
      },
      { where: { id: taskId } }
    );
    await User.update(
      {
        assignedTasks: [...user.assignedTasks, taskId],
      },
      { where: { id: userId } }
    );
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
    if (!task.assignedTo.includes(userId))
      return res.status(409).json({
        message: "User isn't assigned.",
        success: false,
      });
    const user = await User.findByPk(userId);
    if (!user)
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    await Task.update(
      { assignedTo: task.assignedTo.filter((id) => id !== userId) },
      { where: { id: taskId } }
    );
    await User.update(
      { assignedTasks: user.assignedTasks.filter((id) => id !== taskId) },
      { where: { id: userId } }
    );
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
