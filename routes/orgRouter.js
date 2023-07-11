const express = require("express");
const router = express.Router();
const orgController = require("../controllers/orgController");
const { verifyUser } = require("../middlewares/verifyUser");
const { onlyOrgAccess } = require("../middlewares/onlyOrgAccess");

router.post("/register", orgController.orgSignUp);
router.post("/login", orgController.orgLogin);
router.delete("/delete", verifyUser, onlyOrgAccess, orgController.orgDelete);
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
router.get("/view/:orgId", verifyUser, orgController.getOrg);

module.exports = router;
