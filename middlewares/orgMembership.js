const { User } = require("../models");
exports.orgMembership = async (req, res, next) => {
  const orgId = req.orgId;
  const userId = req.user.user.id;
  const userType = req.user.userType;
  try {
    const user = await User.findByPk(userId);
    if (!user)
      return res
        .status(400)
        .json({ message: "User does not exist.", success: false });
    
  } catch (error) {
    res.json({
      message: "Something went wrong.",
      success: false,
      error: error.message,
    });
  }
};
