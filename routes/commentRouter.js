const express = require("express");
const router = express.Router();

const commentController = require("../controllers/commentController");
const { verifyUser } = require("../middlewares/verifyUser");
const { boardMembership } = require("../middlewares/boardMembership");

router.post(
  "/:boardId/:taskId/create",
  verifyUser,
  boardMembership,
  commentController.createComment
);

router.get(
  "/:boardId/:taskId/:commentId",
  verifyUser,
  boardMembership,
  commentController.getComment
);

router.get(
  "/:boardId/:taskId",
  verifyUser,
  boardMembership,
  commentController.getAllComments
);

router.delete(
  "/:boardId/:taskId/:commentId",
  verifyUser,
  boardMembership,
  commentController.deleteComment
)

module.exports = router;
