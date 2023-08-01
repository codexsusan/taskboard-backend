const { v4: uuidv4 } = require("uuid");
const { Board, User, Task, BoardMember } = require("../models");

exports.createBoard = async (req, res) => {
  const orgId = req.orgId;
  const { title, description } = req.body;
  const userType = req.user.userType;
  try {
    const board = await Board.create({
      id: uuidv4(),
      title,
      description,
      orgId,
      stageOrder: [],
    });

    if (userType === "user") {
      const user = await User.findByPk(req.user.user.id);
      if (!user)
        return res
          .json({ message: "User not found", success: false });

      const boardMember = await BoardMember.findOne({
        where: { userId: user.id, boardId: board.id },
      });

      if (boardMember)
        return res.json({
          message: "User already added",
          success: false,
        });

      await BoardMember.create({
        id: uuidv4(),
        userId: user.id,
        boardId: board.id,
      });
    }

    res.status(201).json({
      message: "Board created successfully.",
      success: true,
      data: board,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

exports.updateBoard = async (req, res) => {
  const boardId = req.params.boardId;
  const { title, description } = req.body;
  const orgId = req.orgId;
  try {
    await Board.update(
      { title, description },
      { where: { id: boardId, orgId } }
    );

    res.status(200).json({
      message: "Board updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

exports.deleteBoard = async (req, res) => {
  const boardId = req.params.boardId;
  const orgId = req.orgId;
  const board = req.board;
  try {
    await Board.destroy({ where: { id: boardId, orgId } });
    res.status(200).json({
      message: "Board deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

exports.getBoard = async (req, res) => {
  const boardId = req.params.boardId;
  const orgId = req.orgId;
  try {
    res.status(200).json({
      message: "Board listed successfully",
      success: true,
      data: req.board,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

exports.getAllBoards = async (req, res) => {
  const orgId = req.orgId;
  try {
    const allBoard = await Board.findAll(
      { attributes: { exclude: ["createdAt", "updatedAt"] } },
      { where: { orgId } }
    );
    if (!allBoard)
      return res.json({ message: "Boards not found", success: false });

    if (allBoard.length === 0) {
      return res.json({
        message: "No boards found",
        success: false,
      });
    }

    res.json({
      message: "Boards listed successfully",
      success: true,
      data: allBoard,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

exports.addMember = async (req, res) => {
  const { email } = req.body;
  const orgId = req.orgId;
  const boardId = req.params.boardId;
  try {
    const board = await Board.findOne({ where: { id: boardId, orgId } });
    const user = await User.findOne({ where: { email, orgId } });
    if (!board) return res.json({ message: "Board not found", success: false });
    if (!user) return res.json({ message: "User not found", success: false });
    const boardMemberData = await BoardMember.findOne({
      where: { userId: user.id, boardId },
    });
    if (boardMemberData)
      return res.json({
        message: "User already added",
        success: false,
      });
    const member = await BoardMember.create({
      id: uuidv4(),
      userId: user.id,
      boardId,
    });
    res.status(200).json({
      message: "Member added successfully",
      success: true,
      data: {
        id: member.userId,
        email,
        orgId: user.orgId,
        username: user.username,
      },
    });
  } catch (error) {
    res.json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

exports.removeMember = async (req, res) => {
  const { userId, boardId } = req.params;
  const orgId = req.orgId;
  try {
    const board = await Board.findOne({ where: { id: boardId, orgId } });
    if (!board) return res.json({ message: "Board not found", success: false });
    const user = await User.findOne({ where: { id: userId, orgId } });
    if (!user) return res.json({ message: "User not found", success: false });
    const boardMemberData = await BoardMember.findOne({
      where: { userId: user.id, boardId },
    });
    if (!boardMemberData)
      return res.json({
        message: "User not a board member",
        success: false,
      });
    await BoardMember.destroy({
      where: { userId: user.id, boardId },
    });

    res.status(200).json({
      message: "Member removed successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

exports.getAllBoardsInOrg = async (req, res) => {
  const orgId = req.orgId;
  try {
    const allBoard = await Board.findAll(
      { attributes: { exclude: ["createdAt", "updatedAt"] } },
      { where: { orgId } }
    );
    if (!allBoard)
      return res
        .json({ message: "Boards not found", success: false });

    res.status(200).json({
      message: "Boards listed successfully",
      success: true,
      data: allBoard,
      totalBoards: allBoard.length,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};
