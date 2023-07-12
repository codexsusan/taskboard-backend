const { v4: uuidv4 } = require("uuid");
const { Stage, Board } = require("../models");

exports.createStage = async (req, res) => {
  const boardId = req.params.boardId;
  const title = req.body.title;
  try {
    const board = await Board.findByPk(boardId);
    if (!board)
      return res.status(404).json({
        message: "Board not found.",
        success: false,
      });

    const stage = await Stage.create({
      id: uuidv4(),
      title,
      boardId: boardId,
    });
    await Board.update(
      { stageOrder: [...board.stageOrder, stage.id] },
      { where: { id: boardId } }
    );
    res.status(201).json({
      message: "Stage created.",
      success: true,
      data: stage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      message: error.message,
    });
  }
};

exports.updateStage = async (req, res) => {
  const { boardId, stageId } = req.params;
  const { title } = req.body;
  try {
    const board = await Board.findByPk(boardId);
    if (!board)
      return res.status(404).json({
        message: "Board not found.",
        success: false,
      });

    const stage = await Stage.findOne({ where: { id: stageId, boardId } });
    if (!stage)
      return res.status(404).json({
        message: "Stage not found.",
        success: false,
      });

    await Stage.update({ title }, { where: { id: stageId, boardId } });
    res.status(200).json({
      message: "Stage updated.",
      success: true,
      data: { id: stageId, title },
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      message: error.message,
    });
  }
};

exports.viewStage = async (req, res) => {
  const { boardId, stageId } = req.params;
  try {
    const board = await Board.findByPk(boardId);
    if (!board)
      return res.status(404).json({
        message: "Board not found.",
        success: false,
      });

    const stage = await Stage.findOne(
      { attributes: { exclude: ["createdAt", "updatedAt"] } },
      { where: { id: stageId, boardId } }
    );
    if (!stage)
      return res.status(404).json({
        message: "Stage not found.",
        success: false,
      });

    res.status(200).json({
      message: "Stage found.",
      success: true,
      data: stage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      message: error.message,
    });
  }
};

exports.viewAllStages = async (req, res) => {
  const { boardId } = req.params;
  try {
    const board = await Board.findByPk(boardId);
    if (!board)
      return res.status(404).json({
        message: "Board not found.",
        success: false,
      });

    const stages = await Stage.findAll(
      { attributes: { exclude: ["createdAt", "updatedAt"] } },
      { where: { boardId } }
    );
    res.status(200).json({
      message: "Stages found.",
      success: true,
      data: stages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      message: error.message,
    });
  }
};

exports.deleteStage = async (req, res) => {
  const { boardId, stageId } = req.params;
  try {
    const board = await Board.findByPk(boardId);
    if (!board)
      return res.status(404).json({
        message: "Board not found.",
        success: false,
      });

    const stage = await Stage.findOne({ where: { id: stageId, boardId } });
    if (!stage)
      return res.status(404).json({
        message: "Stage not found.",
        success: false,
      });

    await Board.update(
      { stageOrder: board.stageOrder.filter((id) => id !== stageId) },
      { where: { id: boardId } }
    );

    await Stage.destroy({ where: { id: stageId, boardId } });
    res.status(200).json({
      message: "Stage deleted.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      message: error.message,
    });
  }
};
