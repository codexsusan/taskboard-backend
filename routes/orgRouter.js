const express = require("express");
const router = express.Router();
const orgController = require("../controllers/orgController");

router.post("/register", orgController.orgSignUp);
router.post("/login", orgController.orgLogin);

module.exports = router;