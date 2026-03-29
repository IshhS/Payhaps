const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/invite", auth, userController.createUser);

module.exports = router;