const { v4: uuidv4 } = require("uuid");
const { Board, User } = require("../models");

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
      assignedMembers: userType === "org" ? [] : [req.user.user.id],
    });

    if (userType === "user") {
      const user = await User.findByPk(req.user.user.id);
      if (!user)
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      await User.update(
        {
          associatedBoards: user.associatedBoards
            ? [...user.associatedBoards, board.id]
            : [board.id],
        },
        { where: { id: req.user.user.id } }
      );
    }

    res
      .status(201)
      .json({ message: "Board created successfully.", success: true, board });
  } catch (error) {
    res.status(500).json({
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
    const board = await Board.findOne({ where: { id: boardId, orgId } });
    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", success: false });

    await Board.update({ title, description }, { where: { id: boardId } });

    res.status(200).json({
      message: "Board updated successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

exports.deleteBoard = async (req, res) => {
  const boardId = req.params.boardId;
  const orgId = req.orgId;
  try {
    const board = await Board.findOne({ where: { id: boardId, orgId } });
    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", success: false });

    const deletedBoard = await Board.destroy({ where: { id: boardId } });
    res.status(200).json({
      message: "Board deleted successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
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
    const board = await Board.findOne(
      {
        attributes: [
          "id",
          "title",
          "description",
          "stageOrder",
          "assignedMembers",
        ],
      },
      { where: { id: boardId, orgId } }
    );
    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", success: false });

    res
      .status(200)
      .json({ message: "Board listed successfully", success: true, board });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

exports.getAllBoards = async (req, res) => {
  const orgId = req.orgId;
  console.log("Logging from line 119");
  try {
    const allBoard = await Board.findAll(
      { attributes: { exclude: ["createdAt", "updatedAt"] } },
      { where: { orgId } }
    );
    if (!allBoard)
      return res
        .status(404)
        .json({ message: "Boards not found", success: false });

    res.status(200).json({
      message: "Boards listed successfully",
      success: true,
      boards: allBoard,
    });
  } catch (error) {
    res.status(500).json({
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
  const userType = req.user.userType;
  if (userType !== "org")
    return res.status(401).json({ message: "Unauthorized", success: false });
  try {
    const board = await Board.findOne({ where: { id: boardId, orgId } });
    const user = await User.findOne({ where: { email, orgId } });

    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", success: false });
    if (!user)
      return res
        .status(404)
        .json({ message: "User not found", success: false });

    if (board.assignedMembers.includes(user.id)) {
      return res.status(400).json({
        message: "User already added",
        success: false,
      });
    }
    await User.update(
      {
        associatedBoards: user.associatedBoards
          ? [...user.associatedBoards, board.id]
          : [board.id],
      },
      {
        where: { id: user.id },
      }
    );
    let updatedBoard;
    if (board.assignedMembers.length === 0) {
      updatedBoard = await Board.update(
        { assignedMembers: [user.id] },
        { where: { id: boardId, orgId } }
      );
    } else {
      updatedBoard = await Board.update(
        {
          assignedMembers: [...board.assignedMembers, user.id],
        },
        {
          where: {
            id: boardId,
            orgId,
          },
        }
      );
    }
    res.status(200).json({
      message: "Member added successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};

exports.removeMember = async (req, res) => {
  const { userId, boardId } = req.params;
  const orgId = req.orgId;
  const userType = req.user.userType;
  if (userType !== "org")
    return res.status(401).json({ message: "Unauthorized", success: false });
  try {
    const board = await Board.findOne({ where: { id: boardId, orgId } });
    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", success: false });
    if (!board.assignedMembers.includes(userId)) {
      return res.status(400).json({
        message: "User not a board member",
        success: false,
      });
    }
    const user = await User.findOne({ where: { id: userId, orgId } });
    await User.update(
      {
        associatedBoards: user.associatedBoards.filter(
          (board) => board !== boardId
        ),
      },
      {
        where: { id: user.id },
      }
    );
    const updatedBoard = await Board.update(
      {
        assignedMembers: board.assignedMembers.filter(
          (member) => member !== userId
        ),
      },
      { where: { id: boardId, orgId } }
    );

    res.status(200).json({
      message: "Member removed successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};
