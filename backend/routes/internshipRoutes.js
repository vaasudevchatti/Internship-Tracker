const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");

const {
  createInternship,
  getAllInternships,
  updateInternship,
  uploadCompletionCert,
  generateSummaryPDF,
} = require("../controllers/internshipController");

// 👉 ADD THIS DEBUG LOG
console.log("DEBUG - Loaded internship controller:", {
  createInternship,
  getAllInternships,
  updateInternship,
  uploadCompletionCert,
  generateSummaryPDF,
});

const multer = require("multer");

// file upload storage (offer letters & certificates)
const upload = multer({ dest: "uploads/" });

// student: submit new internship
router.post("/", authMiddleware, upload.single("offer_letter"), createInternship);

// student + faculty + admin: list internships
router.get("/", authMiddleware, getAllInternships);

// faculty: update (approve / reject / remarks)
router.patch("/:id", authMiddleware, updateInternship);

// student: upload completion certificate
router.post(
  "/:id/upload-completion-cert",
  authMiddleware,
  upload.single("completion_cert"),
  uploadCompletionCert
);

// student: download summary PDF
router.get("/:id/summary-pdf", authMiddleware, generateSummaryPDF);

module.exports = router;
