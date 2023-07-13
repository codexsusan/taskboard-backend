const { Task, Comment } = require("../models");
const { v4: uuidv4 } = require("uuid");

exports.createComment = async (req, res) => {
  const { taskId } = req.params;
  const { comment } = req.body;
  const userType = req.user.userType;
  try {
    const task = await Task.findByPk(taskId);
    if (!task)
      return res.status(404).json({
        message: "Task not found.",
        success: false,
      });

    if (userType === "org") {
      const orgId = req.orgId;
      const newComment = await Comment.create({
        id: uuidv4(),
        comment,
        userType,
        orgId,
        taskId,
      });
      return res.status(201).json({
        message: "Comment created successfully.",
        success: true,
        comment: newComment,
      });
    }
    if (userType === "user") {
      const userId = req.user.user.id;
      const newComment = await Comment.create({
        id: uuidv4(),
        comment,
        userType,
        userId,
        taskId,
      });
      return res.status(201).json({
        message: "Comment created successfully",
        success: true,
        comment: newComment,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.getComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment)
      return res.status(404).json({
        message: "Comment not found.",
        success: false,
      });
    res.status(200).json({
      message: "Comment fetched successfully.",
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.getAllComments = async (req, res) => {
  const { taskId } = req.params;
  try {
    const comments = await Comment.findAll({
      where: { taskId },
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({
      message: "Comments fetched successfully.",
      success: true,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findByPk(commentId);
    if (!comment)
      return res.status(404).json({
        message: "Comment not found.",
        success: false,
      });
    await comment.destroy();
    res.status(200).json({
      message: "Comment deleted successfully.",
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
