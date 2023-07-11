const { User } = require("../models");
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
  console.log("Org id", orgId);
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
    });

    res
      .status(201)
      .json({ message: "Successfully registered.", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};
