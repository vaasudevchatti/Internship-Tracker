const Internship = require("../models/Internship");
const Report = require("../models/Report");
const PDFDocument = require("pdfkit");
const mongoose = require("mongoose");

// CREATE INTERNSHIP
exports.createInternship = async (req, res) => {
  try {
    const data = req.body;

    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const internship = await Internship.create({
      ...data,
      student_id: req.user.id,
      student_name: req.user.name,
      student_email: req.user.email,
      offer_letter_url: fileUrl,
    });

    const formatted = {
      id: internship._id.toString(),
      ...internship.toObject(),
    };

    delete formatted._id;   // IMPORTANT
    delete formatted.__v;

    return res.json(formatted);
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ message: "Error creating internship" });
  }
};


// GET ALL INTERNSHIPS
// backend/controllers/internshipController.js
exports.getAllInternships = async (req, res) => {
  try {
    let internships;

    // get internships based on role
    if (req.user && req.user.role === "student") {
      internships = await Internship.find({ student_id: req.user.id });
    } else {
      internships = await Internship.find();
    }

    // ---- AUTO UPDATE LOGIC HERE ----
    const today = new Date();

    const updates = internships.map(async (internship) => {
      if (
        internship.status === "approved" &&
        internship.end_date &&
        new Date(internship.end_date) < today
      ) {
        internship.status = "completed";
        await internship.save();
      }
    });

    await Promise.all(updates);
    // ---------------------------------

    // fetch again to return updated statuses
    const fresh = await Internship.find(
      req.user && req.user.role === "student"
        ? { student_id: req.user.id }
        : {}
    );

    const payload = fresh.map((i) => {
      const obj = i.toObject();
      return {
        ...obj,
        id: i._id.toString(),
        _id: i._id.toString(),
      };
    });

    return res.json(payload);
  } catch (err) {
    console.error("GET ALL INTERNSHIPS ERROR:", err);
    return res.status(500).json({ message: "Error fetching internships" });
  }
};

// FACULTY UPDATE INTERNSHIP
exports.updateInternship = async (req, res) => {
  try {
    if (!["faculty", "admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only faculty or admin can review internships" });
    }

    const internshipId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(internshipId)) {
      return res.status(400).json({ message: "Invalid internship id" });
    }

    const updates = {};

    if (req.body.status && ["approved", "rejected", "pending"].includes(req.body.status)) {
      updates.status = req.body.status;
    }

    if (req.body.faculty_remarks !== undefined) {
      updates.faculty_remarks = req.body.faculty_remarks;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const updated = await Internship.findByIdAndUpdate(internshipId, updates, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Internship not found" });
    }

    const payload = {
      id: updated._id.toString(),
      ...updated.toObject(),
      _id: updated._id.toString(),
    };

    delete payload.__v;

    return res.json(payload);
  } catch (err) {
    console.error("UPDATE INTERNSHIP ERROR:", err);
    return res.status(500).json({ message: "Error updating internship" });
  }
};

// UPLOAD COMPLETION CERTIFICATE
exports.uploadCompletionCert = async (req, res) => {
  try {
    const fileUrl = `/uploads/${req.file.filename}`;

    const updated = await Internship.findByIdAndUpdate(
      req.params.id,
      {
        completion_cert_url: fileUrl,
        status: "completed",  // AUTO-MARK AS COMPLETED
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Internship not found" });
    }

    return res.json({
      id: updated._id.toString(),
      ...updated.toObject(),
    });
  } catch (err) {
    console.error("CERT UPLOAD ERROR:", err);
    res.status(500).json({ message: "Error uploading certificate" });
  }
};


exports.generateSummaryPDF = async (req, res) => {
  try {
    const internshipId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(internshipId)) {
      return res.status(400).json({ detail: "Invalid internship id" });
    }

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ detail: "Internship not found" });
    }

    if (req.user.role === "student" && internship.student_id !== req.user.id) {
      return res.status(403).json({ detail: "Not authorized" });
    }

    const reports = await Report.find({ internship_id: internshipId }).sort({ week_number: 1 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="internship-summary-${internshipId}.pdf"`
    );

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text("Internship Summary", { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Student: ${internship.student_name} (${internship.student_email})`);
    doc.text(`Company: ${internship.company_name}`);
    doc.text(`Duration: ${internship.duration || "N/A"}`);
    doc.text(`Period: ${internship.start_date} to ${internship.end_date}`);
    doc.text(`Mode: ${internship.mode || "N/A"}`);
    doc.text(`Status: ${internship.status}`);
    if (internship.stipend) doc.text(`Stipend: ${internship.stipend}`);
    if (internship.supervisor_name) {
      doc.text(`Supervisor: ${internship.supervisor_name} (${internship.supervisor_email || "N/A"})`);
    }
    if (internship.faculty_remarks) {
      doc.moveDown();
      doc.text(`Faculty Remarks: ${internship.faculty_remarks}`);
    }

    if (reports.length > 0) {
      doc.moveDown();
      doc.fontSize(16).text("Progress Reports");
      reports.forEach((report) => {
        doc.moveDown();
        doc.fontSize(12).text(`Week ${report.week_number}`);
        doc.text(`Work Summary: ${report.work_summary}`);
        if (report.hours_worked) doc.text(`Hours Worked: ${report.hours_worked}`);
        if (report.tasks_completed) doc.text(`Tasks Completed: ${report.tasks_completed}`);
        if (report.marks != null) doc.text(`Marks: ${report.marks}`);
        if (report.faculty_comments) doc.text(`Faculty Comments: ${report.faculty_comments}`);
      });
    }

    doc.end();
  } catch (err) {
    console.error("PDF GENERATION ERROR:", err);
    if (!res.headersSent) {
      res.status(500).json({ detail: "Error generating PDF" });
    }
  }
};

// CALCULATE ACTIVE INTERNSHIPS
exports.getActiveInternshipCount = async () => {
  const today = new Date();

  const active = await Internship.countDocuments({
    status: "approved",
    start_date: { $lte: today.toISOString().split("T")[0] },
    end_date: { $gte: today.toISOString().split("T")[0] },
  });

  return active;
};
