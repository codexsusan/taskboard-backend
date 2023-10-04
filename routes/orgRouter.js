const express = require("express");
const router = express.Router();
const orgController = require("../controllers/orgController");
const { verifyUser } = require("../middlewares/verifyUser");
const { onlyOrgAccess } = require("../middlewares/onlyOrgAccess");
const upload = require("../middlewares/multer");

router.post("/register", orgController.orgSignUp);
router.post("/login", orgController.orgLogin);
router.delete("/delete", verifyUser, orgController.orgDelete);
router.get("/view/:orgId", verifyUser, orgController.getOrg);

// TODO: Not Checked
router.patch(
  "/update/basic",
  verifyUser,
  onlyOrgAccess,
  orgController.orgUpdateBasic
);

router.patch(
  "/update/credentials",
  verifyUser,
  onlyOrgAccess,
  orgController.updateCredentials
);

router.patch(
  "/update/avatar",
  verifyUser,
  onlyOrgAccess,
  upload.single("avatar"),
  orgController.avatar
);

module.exports = router;
