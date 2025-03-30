const express = require("express");
const { createWorkflow, getWorkflows } = require("../controllers/workflowController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Workflow routes
router.post("/", createWorkflow);
router.get("/", getWorkflows);

module.exports = router;
