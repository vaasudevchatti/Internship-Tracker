const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  id: { type: String, required: true },         // uuid
  internship_id: { type: String, required: true },
  student_id: { type: String, required: true },
  week_number: { type: Number, required: true },
  work_summary: { type: String, required: true },
  hours_worked: { type: Number, default: null },
  tasks_completed: { type: String, default: null },
  report_file_url: { type: String, default: null },
  faculty_comments: { type: String, default: null },
  marks: { type: Number, default: null },
  created_at: { type: Date, default: () => new Date() }
});

module.exports = mongoose.model("Report", reportSchema);
