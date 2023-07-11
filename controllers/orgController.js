const { Org, User, Board } = require("../models");
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

    org = await Org.createOrg(orgname, email, hashPassword);

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
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
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
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.orgDelete = async (req, res) => {
  const orgId = req.orgId;
  try {
    const org = await Org.findByPk(orgId);
    if (!org)
      return res
        .status(400)
        .json({ message: "Organization does not exist.", success: false });
    await Org.destroy({ where: { id: orgId } });
    res.status(200).json({ message: "Successfully deleted.", success: true });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.orgUpdateBasic = async (req, res) => {
  const orgId = req.orgId;
  const { orgname, email } = req.body;
  try {
    const org = await Org.findByPk(orgId);
    if (!org)
      return res
        .status(400)
        .json({ message: "Organization does not exist.", success: false });
    await Org.update({ orgname, email }, { where: { id: orgId } });
    res.status(200).json({ message: "Successfully updated.", success: true });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.updateCredentials = async (req, res) => {
  const orgId = req.orgId;
  const { oldPassword, newPassword } = req.body;
  try {
    const org = await Org.findByPk(orgId);

    if (!org)
      return res
        .status(400)
        .json({ message: "Organization does not exist.", success: false });

    const isMatch = await bcrypt.compare(oldPassword, org.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid credentials.", success: false });

    const salt = await bcrypt.genSalt(saltRounds);

    const hashPassword = await bcrypt.hash(newPassword, salt);

    await Org.update({ password: hashPassword }, { where: { id: orgId } });

    res.status(200).json({ message: "Successfully updated.", success: true });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};

exports.getOrg = async (req, res) => {
  const orgId = req.params.orgId;
  const requestOrgId = req.orgId;
  if (orgId !== requestOrgId)
    return res.status(400).json({ message: "Unauthorized.", success: false });
  try {
    const org = await Org.findByPk(orgId, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    if (!org)
      return res
        .status(400)
        .json({ message: "Organization does not exist.", success: false });
    res
      .status(200)
      .json({ message: "Successfully fetched.", success: true, data: org });
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};
