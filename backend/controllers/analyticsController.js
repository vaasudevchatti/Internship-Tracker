const User = require("../models/User");
const Internship = require("../models/Internship");

exports.getDashboardStats = async (req, res) => {
  try {
    const total_students = await User.countDocuments({ role: "student" });
    const total_internships = await Internship.countDocuments();
    const pending_approvals = await Internship.countDocuments({ status: "pending" });

    // ---- ACTIVE INTERNSHIPS FIX ----
    const today = new Date().toISOString().split("T")[0];

    const active_internships = await Internship.countDocuments({
      status: "approved",
      start_date: { $lte: today },
      end_date: { $gte: today },
    });

    // ---- COMPLETED INTERNSHIPS (we'll fix later) ----
    const completed_internships = await Internship.countDocuments({ status: "completed" });

    // ---- TOP COMPANIES ----
    const top_companies = await Internship.aggregate([
      { $group: { _id: "$company_name", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      total_students,
      total_internships,
      pending_approvals,
      active_internships,     // ← FIXED VALUE
      completed_internships,
      top_companies
    });
  } catch (err) {
    console.error("ANALYTICS ERROR:", err);
    res.status(500).json({ detail: "Error fetching analytics" });
  }
};
