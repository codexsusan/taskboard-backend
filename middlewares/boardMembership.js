const { Board, BoardMember } = require("../models");
exports.boardMembership = async (req, res, next) => {
  const { boardId } = req.params;
  const orgId = req.orgId;
  try {
    const board = await Board.findOne({ where: { id: boardId, orgId } });
    if (!board) return res.json({ message: "Board not found", success: false });
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
      return res.json({ message: "You are not a member of this board.", success: false });
    }
  } catch (error) {
    
    res.json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};
