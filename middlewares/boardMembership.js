const { Board } = require("../models");
exports.boardMembership = async (req, res, next) => {
  const { boardId } = req.params;
  const orgId = req.orgId;
  try {
    const board = await Board.findOne({ where: { id: boardId, orgId } });
    if (!board)
      return res
        .status(404)
        .json({ message: "Board not found", success: false });
    if (req.user.userType === "org") return next();
    const userId = req.user.user.id;
    if (board.assignedMembers.includes(userId)) {
      next();
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
