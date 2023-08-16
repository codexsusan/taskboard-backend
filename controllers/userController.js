const { User, Board, BoardMember } = require("../models");
const { v4: uuidv4 } = require("uuid");
const cloudinary = require("../middlewares/cloudinary");
const fs = require("fs");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.userLogIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    if (!user)
      return res.json({ message: "Invalid credentials.", success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.json({ message: "Invalid credentials.", success: false });

    const data = {
      user: {
        id: user.id,
      },
      userType: "user",
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    res.status(200).json({
      message: "Successfully logged in.",
      success: true,
      authToken,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        orgId: user.orgId,
      },
    });
  } catch (error) {
    res.json({
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
    let user = await User.findOne(
      { where: { email } },
      { attributes: { exclude: ["updatedAt"] } }
    );
    if (user)
      return res.json({
        message: "User already exists! Please try with different email",
        success: false,
      });

    // Hashing the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      id: uuidv4(),
      username,
      email,
      password: hashPassword,
      orgId,
    });

    res.status(201).json({
      message: "Successfully registered.",
      success: true,
      data: user,
    });
  } catch (error) {
    res.json({
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
      return res.json({ message: "User does not exist.", success: false });

    await User.update({ username, email }, { where: { id: userId } });

    res.status(200).json({ message: "Successfully updated.", success: true });
  } catch (error) {
    error;
    res.json({
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
      return res.json({ message: "User does not exist.", success: false });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.json({ message: "Invalid credentials.", success: false });

    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await User.update({ password: hashPassword }, { where: { id: userId } });

    res.status(200).json({ message: "Successfully updated.", success: true });
  } catch (error) {
    res.json({
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
      return res.json({ message: "User does not exist.", success: false });

    if (userType === "org") {
      if (user.orgId !== orgId)
        return res.json({ message: "Unauthorized.", success: false });
    }

    if (userType === "user") {
      const requestorId = req.user.user.id;
      const requestorUser = await User.findByPk(requestorId);
      if (user.orgId !== requestorUser.orgId)
        return res.json({ message: "Unauthorized.", success: false });
    }

    res
      .status(200)
      .json({ message: "Successfully fetched.", success: true, data: user });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.getAllUsersInBoard = async (req, res) => {
  const boardId = req.params.boardId;
  try {
    let board = await Board.findByPk(boardId);
    if (!board)
      return res.json({ message: "Board does not exist.", success: false });

    const boardMembers = await BoardMember.findAll({
      where: { boardId },
      attributes: ["userId"],
    });
    const members = boardMembers.map((member) => member.userId);
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
      .json({ message: "Successfully fetched.", success: true, data: users });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.getAllUsersPaginated = async (req, res) => {
  const orgId = req.orgId;
  const { page, limit } = req.query;
  const startIndex = parseInt((page - 1) * limit);
  const endIndex = parseInt(page * limit);
  try {
    let results = {};
    const allData = await User.findAll({
      where: { orgId },
    });
    if (startIndex > 0) {
      results.previous = {
        page: parseInt(page) - 1,
        limit: limit,
      };
    }
    if (endIndex < allData.length) {
      results.next = {
        page: parseInt(page) + 1,
        limit: limit,
      };
    }
    results.results = allData.slice(startIndex, endIndex);
    res.status(200).json({
      message: "Successfully fetched.",
      success: true,
      data: results,
      totalMembers: allData.length,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.getAllUsersInOrg = async (req, res) => {
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
      .json({ message: "Successfully fetched.", success: true, data: users });
  } catch (error) {
    res.json({
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
      return res.json({ message: "User does not exist.", success: false });

    if (userType === "org") {
      if (user.orgId !== orgId)
        return res.json({ message: "Unauthorized.", success: false });
    }
    console.log(userType);

    if (userType === "user") {
      const requestorId = req.user.user.id;
      const requestorUser = await User.findByPk(requestorId);
      if (userId !== requestorUser.id)
        return res.json({ message: "Unauthorized.", success: false });
    }
    await User.destroy({ where: { id: userId } });

    res.status(200).json({ message: "Successfully deleted.", success: true });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.avatar = async (req, res) => {
  const userId = req.user.user.id;
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${userId}-${req.file.fieldname}`,
    });

    const image = result.secure_url;
    await User.update({ image }, { where: { id: userId } });

    res.json({
      message: "Successfully",
      imageUrl: result.secure_url,
      success: true,
    });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};
