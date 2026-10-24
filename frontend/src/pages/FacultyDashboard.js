// src/pages/FacultyDashboard.js
import { useState, useEffect } from "react";
import { api } from "../App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, FileText, MessageSquare, Building2, Calendar, User } from "lucide-react";
import { Users, Clock, CheckCircle } from "lucide-react";


export default function FacultyDashboard({ user, onLogout }) {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null); // the internship object currently being reviewed / viewed
  const [reports, setReports] = useState([]);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reportsListOpen, setReportsListOpen] = useState(false);
  const [reportFeedbackOpen, setReportFeedbackOpen] = useState(false);
  const [loading, setLoading] = useState(false);


  const [reviewForm, setReviewForm] = useState({
    status: "",
    faculty_remarks: "",
  });

  const [reportReviewForm, setReportReviewForm] = useState({
    faculty_comments: "",
    marks: "",
  });
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await api.get("/internships");
      // make sure each item has `id`
      const fixedData = res.data.map((item) => ({
        ...item,
        id: item.id || item._id || (item._id ? item._id.toString() : undefined),
      }));
      setInternships(fixedData);
    } catch (error) {
      console.error("Fetch internships error:", error);
      toast.error("Failed to fetch internships");
    }
  };

  const fetchReports = async (internshipId) => {
    try {
      const res = await api.get(`/reports/${internshipId}`);
      setReports(res.data);
    } catch (error) {
      toast.error("Failed to fetch reports");
    }
  };

  // when user clicks review button - open dialog and set selectedInternship
  const openReviewFor = (internship) => {
    setSelectedInternship(internship);
    // reset form
    setReviewForm({ status: "", faculty_remarks: internship.faculty_remarks || "" });
    setReviewDialogOpen(true);
  };

  const handleReview = async (e) => {
    e.preventDefault();

    if (!selectedInternship) {
      toast.error("No internship selected");
      return;
    }

    const internshipId =
      selectedInternship.id ||
      selectedInternship._id?.toString?.() ||
      selectedInternship._id;

    if (!internshipId) {
      toast.error("Invalid internship id");
      return;
    }

    if (!reviewForm.status) {
      toast.error("Please select a decision");
      return;
    }

    setLoading(true);

    try {
      const finalStatus = reviewForm.status.trim().toLowerCase();

      await api.patch(`/internships/${internshipId}`, {
        status: finalStatus,
        faculty_remarks: reviewForm.faculty_remarks,
      });

      toast.success("Review submitted successfully!");
      setReviewDialogOpen(false);
      setSelectedInternship(null);
      await fetchInternships();
    } catch (error) {
      console.error("handleReview error:", error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to submit review"
      );
    } finally {
      setLoading(false);
      setReviewForm({ status: "", faculty_remarks: "" });
    }
  };

  const handleReportReview = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    setLoading(true);
    try {
      await api.patch(`/reports/${selectedReport.id}`, {
        faculty_comments: reportReviewForm.faculty_comments,
        marks: reportReviewForm.marks ? parseFloat(reportReviewForm.marks) : null,
      });
      toast.success("Report reviewed successfully!");
      setReportFeedbackOpen(false);
      if (selectedInternship) fetchReports(selectedInternship.id);
      setReportReviewForm({ faculty_comments: "", marks: "" });
    } catch (error) {
      toast.error("Failed to review report");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-500 text-black",
      approved: "bg-green-600 text-white",
      rejected: "bg-red-500 text-white",
      active: "bg-blue-500 text-white",
      completed: "bg-purple-500 text-white",
    };
    return colors[status] || "bg-gray-400 text-white";
  };

  const pendingCount = internships.filter((i) => i.status === "pending").length;
  const approvedCount = internships.filter((i) => i.status === "approved" || i.status === "active").length;

  return (
    <div className="min-h-screen bg-[#F7F9FF]">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user.name}</p>
          </div>
          <Button variant="outline" onClick={onLogout} data-testid="logout-btn">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#D4AF37] to-[#b68a28] text-white shadow-xl rounded-xl">
            <CardHeader className="pb-3 flex items-center justify-between">
              <div>
                <CardDescription className="text-white">Total Submissions</CardDescription>
                <CardTitle className="text-3xl">{internships.length}</CardTitle>
              </div>
              <Users className="w-8 h-8 opacity-80" />
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-[#6A5ACD] to-[#483D8B] text-white shadow-xl rounded-xl">
            <CardHeader className="pb-3 flex items-center justify-between">
              <div>
                <CardDescription className="text-white">Pending Review</CardDescription>
                <CardTitle className="text-3xl text-white">{pendingCount}</CardTitle>
              </div>
              <Clock className="w-8 h-8 opacity-80" />
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-[#228B22] to-[#116611] text-white shadow-xl rounded-xl">
            <CardHeader className="pb-3 flex items-center justify-between">
              <div>
                <CardDescription className="text-white">Approved</CardDescription>
                <CardTitle className="text-3xl text-white">{approvedCount}</CardTitle>
              </div>
              <CheckCircle className="w-8 h-8 opacity-80" />
            </CardHeader>
          </Card>
        </div>

        {/* Internships List */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="bg-white shadow-sm rounded-lg border px-2 py-1">
            <TabsTrigger className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md px-4 py-2" value="pending" data-testid="pending-tab">Pending ({pendingCount})</TabsTrigger>
            <TabsTrigger className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md px-4 py-2" value="all" data-testid="all-tab">All Internships</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {internships.filter((i) => i.status === "pending").length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No pending reviews</p>
                </CardContent>
              </Card>
            ) : (
              internships
                .filter((i) => i.status === "pending")
                .map((internship) => (
                  <Card
                    key={internship.id}
                    className="rounded-2xl shadow-sm hover:shadow-md transition border border-slate-200 bg-white px-5 py-4 mb-4"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                              <Building2 className="w-4 h-4" />
                            </div>

                            {internship.company_name}
                          </CardTitle>

                          <CardDescription className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {internship.student_name} ({internship.student_email})
                          </CardDescription>

                          <CardDescription className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {internship.start_date} to {internship.end_date}
                          </CardDescription>
                        </div>

                        {/* ALWAYS show a real badge */}
                        <Badge className={`${getStatusColor(internship.status)} px-2 py-1 rounded-full`}>
                          {internship.status || "pending"}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-700">
                          <div>
                            <span className="text-muted-foreground">Duration:</span> {internship.duration}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Mode:</span> {internship.mode}
                          </div>

                          {internship.stipend && (
                            <div>
                              <span className="text-muted-foreground">Stipend:</span> {internship.stipend}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-3 pt-3">
                          {internship.offer_letter_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid="view-offer-letter-btn"
                              onClick={() =>
                                window.open(
                                  `${process.env.REACT_APP_BACKEND_URL}/api${internship.offer_letter_url}`,
                                  "_blank"
                                )
                              }
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              View Offer Letter
                            </Button>
                          )}

                          {/* FIXED REVIEW BUTTON — Correct DialogTrigger */}
                          <Button
                            size="sm"
                            data-testid={`review-btn-${internship.id}`}
                            onClick={() => openReviewFor(internship)}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Review
                          </Button>

                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {internships.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No internships found</p>
                </CardContent>
              </Card>
            ) : (
              internships.map((internship) => (
                <Card
                  key={internship.id}
                  className="rounded-2xl shadow-sm hover:shadow-md transition border border-slate-200 bg-white px-5 py-4"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          {internship.company_name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {internship.student_name} ({internship.student_email})
                        </CardDescription>
                        <CardDescription className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {internship.start_date} to {internship.end_date}
                        </CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(internship.status)} px-3 py-1 rounded-full shadow`}>
                        {internship.status || "unknown"}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Duration:</span> {internship.duration}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Mode:</span> {internship.mode}
                        </div>
                        {internship.stipend && (
                          <div>
                            <span className="text-muted-foreground">Stipend:</span> {internship.stipend}
                          </div>
                        )}
                      </div>

                      {internship.faculty_remarks && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm font-medium text-blue-800">Faculty Remarks:</p>
                          <p className="text-sm text-blue-700">{internship.faculty_remarks}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2">
                        {internship.offer_letter_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`${process.env.REACT_APP_BACKEND_URL}/api${internship.offer_letter_url}`, "_blank")}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Offer Letter
                          </Button>
                        )}

                        {/* REVIEW button in All too (allowed) */}
                        {internship.status === "pending" && (
                          <Button size="sm" data-testid={`review-btn-all-${internship.id}`} onClick={() => openReviewFor(internship)}>
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        )}

                        {(internship.status === "approved" ||
                          internship.status === "active" ||
                          internship.status === "completed") && (
                            <Button
                              size="sm"
                              variant="outline"
                              data-testid="view-reports-btn"
                              onClick={() => {
                                setSelectedInternship(internship);
                                fetchReports(internship.id);
                                setReportsListOpen(true);
                              }}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              View Reports
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Single Review Dialog (outside the map) */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Review Internship</DialogTitle>
              <DialogDescription>
                {selectedInternship ? `${selectedInternship.student_name} - ${selectedInternship.company_name}` : ""}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleReview} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Decision *</Label>
                <Select
                  name="status"
                  value={reviewForm.status}
                  onValueChange={(value) => setReviewForm({ ...reviewForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="rejected">Reject</SelectItem>
                  </SelectContent>
                </Select>

              </div>

              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea
                  data-testid="faculty-remarks-input"
                  value={reviewForm.faculty_remarks}
                  onChange={(e) => setReviewForm({ ...reviewForm, faculty_remarks: e.target.value })}
                  rows={4}
                  placeholder="Add your comments..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => { setReviewDialogOpen(false); setSelectedInternship(null); }}>
                  Cancel
                </Button>
                <Button type="submit" className="ml-auto" disabled={loading || !reviewForm.status}>
                  {loading ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Reports Dialog (keeps original behavior, unchanged) */}
        {selectedInternship && (
          <Dialog
            open={reportsListOpen}
            onOpenChange={(open) => {
              setReportsListOpen(open);
              if (!open) setSelectedInternship(null);
            }}
          >
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Progress Reports - {selectedInternship.company_name}</DialogTitle>
                <DialogDescription>{selectedInternship.student_name}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {reports.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No reports submitted yet</p>
                ) : (
                  reports.map((report) => (
                    <Card key={report.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">Week {report.week_number}</CardTitle>
                            <CardDescription className="text-xs">
                              Submitted: {new Date(report.created_at).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          {report.marks && <Badge variant="outline">Score: {report.marks}</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium mb-1">Work Summary:</p>
                          <p className="text-sm text-muted-foreground">{report.work_summary}</p>
                        </div>
                        {report.hours_worked && (
                          <div>
                            <span className="text-sm font-medium">Hours Worked:</span> <span className="text-sm">{report.hours_worked}</span>
                          </div>
                        )}
                        {report.tasks_completed && (
                          <div>
                            <p className="text-sm font-medium mb-1">Tasks Completed:</p>
                            <p className="text-sm text-muted-foreground">{report.tasks_completed}</p>
                          </div>
                        )}
                        {report.report_file_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`${process.env.REACT_APP_BACKEND_URL}/api${report.report_file_url}`, "_blank")}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Report File
                          </Button>
                        )}

                        {report.faculty_comments && (
                          <div className="bg-blue-50 border border-blue-200 rounded p-2">
                            <p className="text-xs font-medium text-blue-800">Your Comments:</p>
                            <p className="text-xs text-blue-700">{report.faculty_comments}</p>
                          </div>
                        )}

                        <Dialog open={reportFeedbackOpen} onOpenChange={setReportFeedbackOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              data-testid="add-feedback-btn"
                              onClick={() => {
                                setSelectedReport(report);
                                setReportReviewForm({
                                  faculty_comments: report.faculty_comments || "",
                                  marks: report.marks?.toString() || "",
                                });
                                setReportFeedbackOpen(true);
                              }}
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Add Feedback
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Review Report - Week {report.week_number}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleReportReview} className="space-y-4">
                              <div className="space-y-2">
                                <Label>Comments</Label>
                                <Textarea
                                  data-testid="report-comments-input"
                                  value={reportReviewForm.faculty_comments}
                                  onChange={(e) => setReportReviewForm({ ...reportReviewForm, faculty_comments: e.target.value })}
                                  rows={4}
                                  placeholder="Add your feedback..."
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Marks (Optional)</Label>
                                <Input
                                  data-testid="report-marks-input"
                                  type="number"
                                  step="0.1"
                                  value={reportReviewForm.marks}
                                  onChange={(e) => setReportReviewForm({ ...reportReviewForm, marks: e.target.value })}
                                  placeholder="e.g., 85"
                                />
                              </div>
                              <Button type="submit" data-testid="submit-feedback-btn" className="w-full" disabled={loading}>
                                {loading ? "Submitting..." : "Submit Feedback"}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
