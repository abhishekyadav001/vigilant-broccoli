const mongoose = require("mongoose");

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workflow name is required"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    steps: [
      {
        name: String,
        description: String,
        order: Number,
        status: {
          type: String,
          enum: ["pending", "in_progress", "completed"],
          default: "pending",
        },
      },
    ],
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
workflowSchema.index({ name: 1, createdBy: 1 }, { unique: true });
workflowSchema.index({ status: 1 });
workflowSchema.index({ createdAt: -1 });

// Virtual for workflow progress
workflowSchema.virtual("progress").get(function () {
  if (!this.steps || this.steps.length === 0) return 0;
  const completedSteps = this.steps.filter((step) => step.status === "completed").length;
  return Math.round((completedSteps / this.steps.length) * 100);
});

const Workflow = mongoose.model("Workflow", workflowSchema);

module.exports = Workflow;
