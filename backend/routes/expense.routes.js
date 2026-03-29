const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.controller");
const auth = require("../middlewares/auth.middleware");

// ── Employee routes ─────────────────────────────────────────────
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/", auth, expenseController.createExpense);
router.post("/ocr", auth, upload.single("receipt"), expenseController.processOcrReceipt);
router.get("/my", auth, expenseController.getMyExpenses);

// ── Approver routes ─────────────────────────────────────────────
router.get("/pending-approvals", auth, expenseController.getPendingApprovals);
router.post("/:id/approve", auth, expenseController.approveExpense);
router.post("/:id/reject", auth, expenseController.rejectExpense);

// ── Shared routes ───────────────────────────────────────────────
router.get("/all", auth, expenseController.getAllExpenses);
router.get("/:id", auth, expenseController.getExpenseById);

module.exports = router;