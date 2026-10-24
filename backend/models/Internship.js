const mongoose = require("mongoose");

const InternshipSchema = new mongoose.Schema(
  {
    // FIXED → UUID String, not ObjectId
    student_id: { type: String, ref: "User", required: true },

    student_name: String,
    student_email: String,

    company_name: String,
    duration: String,
    start_date: String,
    end_date: String,
    mode: String,
    stipend: String,

    supervisor_name: String,
    supervisor_email: String,

    status: { type: String, default: "pending" },

    offer_letter_url: String,
    completion_cert_url: String,

    faculty_remarks: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Internship", InternshipSchema);
