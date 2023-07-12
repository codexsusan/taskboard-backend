const { v4: uuidv4 } = require("uuid");
const { Task, Stage } = require("../models");

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

exports.deleteTask = async (req, res) => {
  const { stageId, taskId } = req.params;
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
    await task.destroy();
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
