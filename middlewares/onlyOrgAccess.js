exports.onlyOrgAccess = async (req, res, next) => {
  try {
    if (req.user.userType === "org") return next();
    if (req.user.userType === "user") {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: error.message,
    });
  }
};
