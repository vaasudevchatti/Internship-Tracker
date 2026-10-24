const { v4: uuidv4 } = require("uuid");
const Report = require("../models/Report");

// CREATE REPORT (student)
exports.createReport = async (req, res) => {
  try {
    const {
      internship_id,
      week_number,
      work_summary,
      hours_worked,
      tasks_completed
    } = req.body;

    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const report = await Report.create({
      id: uuidv4(),
      internship_id,
      student_id: req.user.id,
      week_number,
      work_summary,
      hours_worked,
      tasks_completed,
      report_file_url: fileUrl
    });

    res.json(report);
  } catch (err) {
    console.error("CREATE REPORT ERROR:", err);
    res.status(500).json({ detail: "Error creating report" });
  }
};

// GET REPORTS (student + faculty)
exports.getReports = async (req, res) => {
  try {
    const internshipId = req.params.internship_id;

    const reports = await Report.find({ internship_id: internshipId });

    res.json(reports);
  } catch (err) {
    console.error("GET REPORTS ERROR:", err);
    res.status(500).json({ detail: "Error fetching reports" });
  }
};

// UPDATE REPORT (faculty)
exports.updateReport = async (req, res) => {
  try {
    const reportId = req.params.report_id;

    const updated = await Report.findOneAndUpdate(
      { id: reportId },
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("UPDATE REPORT ERROR:", err);
    res.status(500).json({ detail: "Error updating report" });
  }
};
