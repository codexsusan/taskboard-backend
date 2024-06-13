const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const { User, Org } = require("../models");

exports.verifyUser = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.json({ message: "No token found", success: false });
  try {
    const data = jwt.verify(token, JWT_SECRET);
    if (data.user) {
      const user = await User.findOne({ where: { id: data.user.id } });
      if (!user) return res.json({ message: "User not found" });
      req.orgId = user.orgId;
      req.user = data;
    }
    if (data.org) {
      const org = await Org.findOne({ where: { id: data.org.id } });
      if (!org)
        return res.json({ message: "Organization not found" });
      req.orgId = org.id;
      req.user = data;
    }
    next();
  } catch (error) {
    
  }
};
