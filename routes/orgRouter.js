const express = require("express");
const router = express.Router();
const orgController = require("../controllers/orgController");
const { verifyUser } = require("../middlewares/verifyUser");

router.post("/register", orgController.orgSignUp);
router.post("/login", orgController.orgLogin);
router.delete("/delete", verifyUser, orgController.orgDelete);
router.patch("/update/basic", verifyUser, orgController.orgUpdateBasic);
router.patch("/update/credentials", verifyUser, orgController.updateCredentials);

module.exports = router;