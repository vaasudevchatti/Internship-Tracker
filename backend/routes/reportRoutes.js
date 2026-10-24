const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");

const {
  createReport,
  getReports,
  updateReport
} = require("../controllers/reportController");

// file upload (optional for student weekly reports)
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// student: submit weekly report
router.post("/", authMiddleware, upload.single("report_file"), createReport);

// student + faculty: get reports for an internship
router.get("/:internship_id", authMiddleware, getReports);

// faculty: grade/update report
router.patch("/:report_id", authMiddleware, updateReport);

module.exports = router;
