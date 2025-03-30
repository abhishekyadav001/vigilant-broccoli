const express = require('express');
const { createWorkflow, getWorkflows } = require('../controllers/workflowController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createWorkflow);
router.get('/', authMiddleware, getWorkflows);

module.exports = router;