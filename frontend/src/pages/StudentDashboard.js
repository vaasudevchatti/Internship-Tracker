// src/pages/StudentDashboard.js
import { useState, useEffect } from "react";
import { api, openAuthenticatedUrl } from "../App";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  PlusCircle,
  LogOut,
  FileText,
  Upload,
  Download,
  Building2,
  Calendar,
  MapPin,
} from "lucide-react";
import { Users, Clock, CheckCircle } from "lucide-react";



export default function StudentDashboard({ user, onLogout }) {
  const [internships, setInternships] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showCertDialog, setShowCertDialog] = useState(false);

  const [internshipForm, setInternshipForm] = useState({
    company_name: "",
    duration: "",
    start_date: "",
    end_date: "",
    mode: "Remote",
    stipend: "",
    supervisor_name: "",
    supervisor_email: "",
  });
  const [offerLetter, setOfferLetter] = useState(null);

  const [reportForm, setReportForm] = useState({
    week_number: 1,
    work_summary: "",
    hours_worked: "",
    tasks_completed: "",
  });
  const [reportFile, setReportFile] = useState(null);
  const [completionCert, setCompletionCert] = useState(null);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await api.get("/internships");

      console.log("DEBUG: internships received from backend:", res.data);   // ADD THIS

      window.lastInternships = res.data;                                    // ADD THIS

      setInternships(res.data);
    } catch {
      toast.error("Failed to fetch internships");
    }
  };


  const fetchReports = async (internshipId) => {
    try {
      const res = await api.get(`/reports/${internshipId}`);
      setReports(res.data);
    } catch {
      toast.error("Failed to fetch reports");
    }
  };

  const handleAddInternship = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(internshipForm).forEach((key) => {
        formData.append(key, internshipForm[key]);
      });
      if (offerLetter) formData.append("offer_letter", offerLetter);

      await api.post("/internships", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Internship submitted successfully!");
      setShowAddDialog(false);
      fetchInternships();

      setInternshipForm({
        company_name: "",
        duration: "",
        start_date: "",
        end_date: "",
        mode: "Remote",
        stipend: "",
        supervisor_name: "",
        supervisor_email: "",
      });
      setOfferLetter(null);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add internship");
    } finally {
      setLoading(false);
    }
  };

  const handleAddReport = async (e) => {
    e.preventDefault();
    if (!selectedInternship) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("internship_id", selectedInternship.id);
      formData.append("week_number", reportForm.week_number);
      formData.append("work_summary", reportForm.work_summary);
      if (reportForm.hours_worked) formData.append("hours_worked", reportForm.hours_worked);
      if (reportForm.tasks_completed) formData.append("tasks_completed", reportForm.tasks_completed);
      if (reportFile) formData.append("report_file", reportFile);

      await api.post("/reports", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Report submitted successfully!");
      setShowReportDialog(false);
      fetchReports(selectedInternship.id);

      setReportForm({
        week_number: 1,
        work_summary: "",
        hours_worked: "",
        tasks_completed: "",
      });
      setReportFile(null);
    } catch {
      toast.error("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCert = async (e) => {
    e.preventDefault();
    if (!selectedInternship || !completionCert) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("completion_cert", completionCert);

      await api.post(`/internships/${selectedInternship.id}/upload-completion-cert`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Certificate uploaded!");
      setShowCertDialog(false);
      fetchInternships();
      setCompletionCert(null);
    } catch {
      toast.error("Failed to upload certificate");
    } finally {
      setLoading(false);
    }
  };

  const downloadSummary = async (id) => {
    try {
      await openAuthenticatedUrl(`/internships/${id}/summary-pdf`);
    } catch (error) {
      toast.error(error.message || "Failed to open summary PDF");
    }
  };

  const getStatusColor = (status) => {
    const map = {
      pending: "bg-yellow-500",
      approved: "bg-green-500",
      rejected: "bg-red-500",
      active: "bg-blue-500",
      completed: "bg-purple-500",
    };
    return map[status] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-[#F7F4FF]">

      {/* Top header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
            <p className="text-sm text-slate-600">Welcome, {user.name}</p>
          </div>

          <Button variant="outline" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ===================== NEW LAYOUT APPLIED HERE ===================== */}

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
          <Card className="bg-gradient-to-br from-[#D4AF37] to-[#b68a28] text-white shadow-xl rounded-xl">
            <CardHeader className="pb-3 flex items-center justify-between">
              <div>
                <CardDescription className="text-white">Total Internships</CardDescription>
                <CardTitle className="text-3xl">{internships.length}</CardTitle>
              </div>
              <Users className="w-8 h-8 opacity-80" />
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-[#6A5ACD] to-[#483D8B] text-white shadow-xl rounded-xl">
            <CardHeader className="pb-3 flex items-center justify-between">
              <div>
                <CardDescription className="text-white">Active</CardDescription>
                <CardTitle className="text-3xl">
                  {internships.filter((i) => i.status === "active" || i.status === "approved").length}
                </CardTitle>
              </div>
              
                <Clock className="w-8 h-8 opacity-80" />
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-[#228B22] to-[#116611] text-white shadow-xl rounded-xl">
            <CardHeader className="pb-3 flex items-center justify-between">
              <div>
                <CardDescription className="text-white">Completed</CardDescription>
                <CardTitle className="text-3xl">
                  {internships.filter((i) => i.status === "completed").length}
                </CardTitle>
              </div>
              <CheckCircle className="w-8 h-8 opacity-80" />
            </CardHeader>
          </Card>
        </div>

        {/* Add Internship Button BELOW the stats */}
        <div className="mb-8">
          <Button
            className="bg-black text-white hover:opacity-90"
            onClick={() => setShowAddDialog(true)}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add New Internship
          </Button>
        </div>

        {/* ===================== END NEW LAYOUT ===================== */}

        {/* Add Internship Modal */}
        {showAddDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">

            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200">

              {/* HEADER */}
              <div className="p-6 flex items-start justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">Add New Internship</h3>
                  <p className="text-sm text-blue-600 font-medium">Fill in the details</p>
                </div>

                <button
                  onClick={() => setShowAddDialog(false)}
                  className="text-slate-500 hover:text-slate-700 text-xl"
                >
                  ✕
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleAddInternship} className="p-6 space-y-6">

                {/* ROW 1 */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="font-medium text-slate-700">Company Name *</Label>
                    <Input
                      placeholder="Enter company name"

                      className="mt-1 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      value={internshipForm.company_name}
                      onChange={(e) =>
                        setInternshipForm({ ...internshipForm, company_name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label className="font-medium text-slate-700">Duration *</Label>
                    <Input
                      placeholder="e.g., 3 months"
                      className="mt-1 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      value={internshipForm.duration}
                      onChange={(e) =>
                        setInternshipForm({ ...internshipForm, duration: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* ROW 2 */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="font-medium text-slate-700">Start Date *</Label>
                    <Input
                      type="date"
                      className="mt-1 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      value={internshipForm.start_date}
                      onChange={(e) =>
                        setInternshipForm({ ...internshipForm, start_date: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label className="font-medium text-slate-700">End Date *</Label>
                    <Input
                      type="date"
                      className="mt-1 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      value={internshipForm.end_date}
                      onChange={(e) =>
                        setInternshipForm({ ...internshipForm, end_date: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* ROW 3 */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="font-medium text-slate-700">Mode *</Label>
                    <Select
                      value={internshipForm.mode}
                      onValueChange={(value) =>
                        setInternshipForm({ ...internshipForm, mode: value })
                      }
                    >
                      <SelectTrigger className="mt-1 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Remote">Remote</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                        <SelectItem value="Onsite">Onsite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="font-medium text-slate-700">Stipend</Label>
                    <Input
                      placeholder="Optional"

                      className="mt-1 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      value={internshipForm.stipend}
                      onChange={(e) =>
                        setInternshipForm({ ...internshipForm, stipend: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* FILE UPLOAD */}
                <div>
                  <Label className="font-medium text-slate-700">Offer Letter (PDF/Image)</Label>
                  <Input
                    type="file"
                    className="mt-1 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setOfferLetter(e.target.files[0])}
                  />
                </div>

                {/* FOOTER BUTTONS */}
                <div className="flex gap-3 justify-end border-t pt-4">
                  <Button
                    variant="ghost"
                    className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg px-5"
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 shadow"
                  >
                    {loading ? "Submitting..." : "Submit Internship"}
                  </Button>
                </div>

              </form>
            </div>
          </div>
        )}


        {/* Internships List */}
        <div className="space-y-6 mt-6">
          <h2 className="text-xl font-semibold">My Internships</h2>

          {internships.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500">No internships yet.</p>
              </CardContent>
            </Card>
          ) : (
            internships.map((internship) => (
              <Card key={internship.id} className="rounded-xl shadow-md hover:shadow-lg transition">

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className="w-9 h-9 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full">
                          <Building2 className="w-5 h-5" />
                        </div>

                        {internship.company_name}
                      </CardTitle>

                      <CardDescription className="flex gap-4 mt-2">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {internship.start_date} to {internship.end_date}
                        </span>

                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {internship.mode}
                        </span>
                      </CardDescription>
                    </div>

                    <Badge
                      className={`${getStatusColor(
                        internship.status
                      )} text-white px-3 py-1 rounded-full`}
                    >
                      {internship.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-slate-600 mb-2">
                        <strong>Duration:</strong> {internship.duration}
                      </div>
                      {internship.stipend && (
                        <div className="text-sm text-slate-600">
                          <strong>Stipend:</strong> {internship.stipend}
                        </div>
                      )}
                    </div>

                    <div className="flex items-start justify-end gap-2">

                      {internship.offer_letter_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_BACKEND_URL}/api${internship.offer_letter_url}`,
                              "_blank"
                            )
                          }
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Offer Letter
                        </Button>
                      )}

                      {(["approved", "active"].includes(internship.status?.toLowerCase())) && (
                        <>
                          {/* Submit Report */}
                          <Dialog
                            open={showReportDialog}
                            onOpenChange={setShowReportDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedInternship(internship);
                                  fetchReports(internship.id);
                                  setShowReportDialog(true);
                                }}
                                className="flex items-center gap-2"
                              >
                                <Upload className="w-4 h-4" />
                                Submit Report
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Submit Progress Report</DialogTitle>
                                <DialogDescription>
                                  Share your weekly/monthly progress
                                </DialogDescription>
                              </DialogHeader>

                              <Tabs defaultValue="new">
                                <TabsList className="grid grid-cols-2 gap-2 mb-4">
                                  <TabsTrigger value="new">New Report</TabsTrigger>
                                  <TabsTrigger value="history">
                                    History ({reports.length})
                                  </TabsTrigger>
                                </TabsList>

                                {/* New report form */}
                                <TabsContent value="new">
                                  <form
                                    onSubmit={handleAddReport}
                                    className="space-y-4"
                                  >
                                    <Label>Week Number</Label>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={reportForm.week_number}
                                      onChange={(e) =>
                                        setReportForm({
                                          ...reportForm,
                                          week_number: parseInt(e.target.value),
                                        })
                                      }
                                    />

                                    <Label>Work Summary</Label>
                                    <Textarea
                                      rows={4}
                                      value={reportForm.work_summary}
                                      onChange={(e) =>
                                        setReportForm({
                                          ...reportForm,
                                          work_summary: e.target.value,
                                        })
                                      }
                                    />

                                    <Button
                                      type="submit"
                                      className="w-full"
                                      disabled={loading}
                                    >
                                      {loading ? "Submitting..." : "Submit Report"}
                                    </Button>
                                  </form>
                                </TabsContent>

                                {/* History */}
                                <TabsContent value="history">
                                  <div className="space-y-3 max-h-80 overflow-y-auto">
                                    {reports.length === 0 ? (
                                      <p className="text-center text-slate-500 py-8">
                                        No reports submitted yet
                                      </p>
                                    ) : (
                                      reports.map((r) => (
                                        <Card key={r.id}>
                                          <CardHeader className="pb-1">
                                            <CardTitle className="text-sm">
                                              Week {r.week_number}
                                            </CardTitle>
                                          </CardHeader>
                                          <CardContent>
                                            <p className="text-sm">
                                              {r.work_summary}
                                            </p>
                                          </CardContent>
                                        </Card>
                                      ))
                                    )}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </DialogContent>
                          </Dialog>

                          {/* Upload Completion Certificate */}
                          <Dialog
                            open={showCertDialog}
                            onOpenChange={setShowCertDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedInternship(internship);
                                  setShowCertDialog(true);
                                }}
                              >
                                <Upload className="w-4 h-4 mr-1" />
                                Upload Cert
                              </Button>
                            </DialogTrigger>

                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Upload Completion Certificate
                                </DialogTitle>
                                <DialogDescription>
                                  Upload your internship completion certificate
                                </DialogDescription>
                              </DialogHeader>

                              <form
                                onSubmit={handleUploadCert}
                                className="space-y-4"
                              >
                                <Input
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) =>
                                    setCompletionCert(e.target.files[0])
                                  }
                                />

                                <Button
                                  type="submit"
                                  className="w-full"
                                  disabled={loading}
                                >
                                  {loading
                                    ? "Uploading..."
                                    : "Upload Certificate"}
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}

                      {internship.completion_cert_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            window.open(
                              `${process.env.REACT_APP_BACKEND_URL}/api${internship.completion_cert_url}`,
                              "_blank"
                            )
                          }
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Certificate
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadSummary(internship.id)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Summary
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
