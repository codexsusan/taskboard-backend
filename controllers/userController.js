const { User, Board } = require("../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.userLogIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ where: { email } });
    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid credentials.", success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials.", success: false });

    const data = {
      user: {
        id: user.id,
      },
      userType: "user",
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    res
      .status(200)
      .json({ message: "Successfully logged in.", success: true, authToken });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.userSignUp = async (req, res) => {
  const { username, email, password } = req.body;
  const orgId = req.orgId;
  try {
    let user = await User.findOne({ where: { email } });
    if (user)
      return res
        .status(400)
        .json({ message: "User already exists", success: false });

    // Hashing the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      id: uuidv4(),
      username,
      email,
      password: hashPassword,
      orgId,
      associatedBoards: [],
    });

    res
      .status(201)
      .json({ message: "Successfully registered.", success: true });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.updateBasicInfo = async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user.user.id;
  try {
    let user = await User.findOne({ where: { id: userId } });
    if (!user)
      return res
        .status(400)
        .json({ message: "User does not exist.", success: false });

    await User.update({ username, email }, { where: { id: userId } });

    res.status(200).json({ message: "Successfully updated.", success: true });
  } catch (error) {
    error;
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.updateCredentials = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.user.id;
  try {
    let user = await User.findOne({ where: { id: userId } });
    if (!user)
      return res
        .status(400)
        .json({ message: "User does not exist.", success: false });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials.", success: false });

    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await User.update({ password: hashPassword }, { where: { id: userId } });

    res.status(200).json({ message: "Successfully updated.", success: true });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  const userId = req.params.userId;
  const orgId = req.orgId;
  const userType = req.user.userType;

  try {
    let user = await User.findByPk(userId, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "User does not exist.", success: false });

    if (userType === "org") {
      if (user.orgId !== orgId)
        return res
          .status(401)
          .json({ message: "Unauthorized.", success: false });
    }

    if (userType === "user") {
      const requestorId = req.user.user.id;
      const requestorUser = await User.findByPk(requestorId);
      if (user.orgId !== requestorUser.orgId)
        return res
          .status(401)
          .json({ message: "Unauthorized.", success: false });
    }

    res
      .status(200)
      .json({ message: "Successfully fetched.", success: true, user });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.getAllUsersInBoard = async (req, res) => {
  const boardId = req.params.boardId;
  const orgId = req.orgId;
  try {
    let board = await Board.findByPk(boardId);
    if (!board)
      return res
        .status(400)
        .json({ message: "Board does not exist.", success: false });

    const members = [...board.assignedMembers];
    let users = [];
    for (let i = 0; i < members.length; i++) {
      let user = await User.findByPk(members[i], {
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      });
      users = [...users, user];
    }
    res
      .status(200)
      .json({ message: "Successfully fetched.", success: true, users });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  const orgId = req.orgId;
  try {
    let users = await User.findAll({
      where: { orgId },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res
      .status(200)
      .json({ message: "Successfully fetched.", success: true, users });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.userId;
  const orgId = req.orgId;
  const userType = req.user.userType;

  try {
    let user = await User.findByPk(userId);

    if (!user)
      return res
        .status(400)
        .json({ message: "User does not exist.", success: false });

    if (userType === "org") {
      if (user.orgId !== orgId)
        return res
          .status(401)
          .json({ message: "Unauthorized.", success: false });
    }

    if (userType === "user") {
      const requestorId = req.user.user.id;
      const requestorUser = await User.findByPk(requestorId);
      if (userId !== requestorUser.id)
        return res
          .status(401)
          .json({ message: "Unauthorized.", success: false });
    }

    const boardsId = [...user.associatedBoards];
    for (let i = 0; i < boardsId.length; i++) {
      const board = await Board.findByPk(boardsId[i]);
      let assignedMembers = board.assignedMembers.filter(
        (memberId) => memberId !== user.id
      );
      await Board.update({ assignedMembers }, { where: { id: board.id } });
    }
    await User.destroy({ where: { id: userId } });

    res.status(200).json({ message: "Successfully deleted.", success: true });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};
