const { WorkflowStep } = require("../models");

/**
 * POST /api/workflow-steps
 *
 * Creates workflow steps for the admin's company.
 * Expects an array of steps in the request body.
 *
 * Body example:
 * {
 *   "steps": [
 *     { "step_order": 1, "role": "MANAGER", "is_manager_approver": true },
 *     { "step_order": 2, "role": "FINANCE", "is_manager_approver": false },
 *     { "step_order": 3, "role": "DIRECTOR", "is_manager_approver": false }
 *   ]
 * }
 */
exports.createWorkflowSteps = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Only admins can configure workflows." });
    }

    const { steps } = req.body;

    if (!Array.isArray(steps) || steps.length === 0) {
      return res.status(400).json({ error: "Provide an array of workflow steps." });
    }

    // Validate step_order uniqueness
    const orders = steps.map((s) => s.step_order);
    if (new Set(orders).size !== orders.length) {
      return res.status(400).json({ error: "Each step must have a unique step_order." });
    }

    // Remove existing steps for this company (replace strategy)
    await WorkflowStep.destroy({
      where: { company_id: req.user.company_id },
    });

    // Create new steps
    const records = steps.map((s) => ({
      company_id: req.user.company_id,
      step_order: s.step_order,
      role: s.role,
      is_manager_approver: s.is_manager_approver || false,
    }));

    const created = await WorkflowStep.bulkCreate(records);

    return res.status(201).json({
      message: `${created.length} workflow steps configured.`,
      steps: created,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/workflow-steps
 *
 * Returns all workflow steps for the authenticated user's company.
 */
exports.getWorkflowSteps = async (req, res) => {
  try {
    const steps = await WorkflowStep.findAll({
      where: { company_id: req.user.company_id },
      order: [["step_order", "ASC"]],
    });

    return res.json(steps);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
