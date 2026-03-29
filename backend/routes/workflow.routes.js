const express = require("express");
const router = express.Router();
const workflowController = require("../controllers/workflow.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth, workflowController.createWorkflowSteps);
router.get("/", auth, workflowController.getWorkflowSteps);

module.exports = router;
