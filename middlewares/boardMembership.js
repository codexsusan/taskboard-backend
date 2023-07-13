const { Board, BoardMember } = require("../models");
exports.boardMembership = async (req, res, next) => {
  const { boardId } = req.params;
  const orgId = req.orgId;
  try {
    const board = await Board.findOne({ where: { id: boardId, orgId } });
    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", success: false });
    if (req.user.userType === "org") {
      req.board = board;
      return next();
    }
    const userId = req.user.user.id;
    const boardMember = await BoardMember.findOne({
      where: { userId, boardId },
    });
    if (boardMember) {
      req.board = board;
      return next();
    } else {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};
