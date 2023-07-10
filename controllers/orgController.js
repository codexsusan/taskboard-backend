const { Org } = require("../models");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.orgSignUp = async (req, res) => {
  const { orgname, email, password } = req.body;
  try {
    let org = await Org.findOne({ where: { email } });
    if (org)
      return res
        .status(400)
        .json({ message: "Organization already exists", success: false });

    // Hashing the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    org = await Org.create({
      id: uuidv4(),
      orgname,
      email,
      password: hashPassword,
    });

    // Creating a payload for jwt
    const data = {
      org: {
        id: org.id,
      },
      userType: "org",
    };

    // Signing the jwt token
    const authToken = jwt.sign(data, JWT_SECRET);

    res
      .status(201)
      .json({ message: "Successfully registered.", success: true, authToken });
  } catch (error) {
    console.log(error);
  }
};

exports.orgLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let org = await Org.findOne({ where: { email } });
    if (!org)
      return res
        .status(400)
        .json({ message: "Invalid credentials.", success: false });

    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials.", success: false });

    const data = {
      org: {
        id: org.id,
      },
      userType: "org",
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    
    res
      .status(200)
      .json({ message: "Successfully logged in.", success: true, authToken });
  } catch (error) {
    console.log(error);
  }
  res.json({ message: "Successfully logged in.", email, password });
};
