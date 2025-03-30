const Workflow = require("../models/Workflow");

// Create a new workflow
exports.createWorkflow = async (req, res) => {
  try {
    // Validate request body
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Request body is required",
      });
    }

    // Add user ID to workflow
    const workflowData = {
      ...req.body,
      createdBy: req.user.id,
    };

    // Create and save workflow
    const workflow = new Workflow(workflowData);
    await workflow.save();

    // Return success response
    return res.status(201).json({
      success: true,
      data: workflow,
      message: "Workflow created successfully",
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map((err) => err.message),
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: "A workflow with this name already exists",
      });
    }

    // Handle other errors
    console.error("Workflow creation error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while creating workflow",
    });
  }
};

// Get all workflows with pagination and filtering
exports.getWorkflows = async (req, res) => {
  try {
    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status;

    // Build query
    const query = {
      createdBy: req.user.id, // Only return user's own workflows
    };

    // Add search filter if provided
    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    }

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const workflows = await Workflow.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count for pagination
    const total = await Workflow.countDocuments(query);

    // Return success response
    return res.json({
      success: true,
      data: workflows,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Workflow fetch error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error while fetching workflows",
    });
  }
};
