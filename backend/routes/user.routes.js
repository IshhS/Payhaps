const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/invite", auth, userController.createUser);
router.get("/", auth, userController.getUsers);
router.put("/:id", auth, userController.updateUser);

module.exports = router;