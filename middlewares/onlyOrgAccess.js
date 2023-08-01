exports.onlyOrgAccess = async (req, res, next) => {
  try {
    if (req.user.userType === "org") return next();
    if (req.user.userType === "user") {
      return res.json({ message: "Unauthorized", success: false });
    }
  } catch (error) {
    res.json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};
