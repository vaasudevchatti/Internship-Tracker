import { useState, useEffect } from "react";
import { api } from "../App";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { LogOut, TrendingUp, Users, Briefcase, Clock, CheckCircle, Building2 } from "lucide-react";

export default function AdminDashboard({ user, onLogout }) {
  const [analytics, setAnalytics] = useState(null);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, internshipsRes] = await Promise.all([
        api.get("/analytics/dashboard"),
        api.get("/internships"),
      ]);
      setAnalytics(analyticsRes.data);
      setInternships(internshipsRes.data);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>Admin Dashboard</h1>
            <p className="text-sm text-gray-600">System Overview & Analytics</p>
          </div>
          <Button variant="outline" onClick={onLogout} data-testid="logout-btn">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-white">Total Students</CardDescription>
                <Users className="w-8 h-8 text-blue-100" />
              </div>
              <CardTitle className="text-4xl" data-testid="total-students">{analytics?.total_students || 0}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-green-100">Total Internships</CardDescription>
                <Briefcase className="w-8 h-8 text-green-100" />
              </div>
              <CardTitle className="text-4xl" data-testid="total-internships">{analytics?.total_internships || 0}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-yellow-100">Pending Approvals</CardDescription>
                <Clock className="w-8 h-8 text-yellow-100" />
              </div>
              <CardTitle className="text-4xl" data-testid="pending-approvals">{analytics?.pending_approvals || 0}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-purple-100">Completed</CardDescription>
                <CheckCircle className="w-8 h-8 text-purple-100" />
              </div>
              <CardTitle className="text-4xl" data-testid="completed-internships">{analytics?.completed_internships || 0}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Active Internships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600" data-testid="active-internships">{analytics?.active_internships || 0}</div>
              <p className="text-sm text-muted-foreground mt-1">Currently in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                Top Companies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics?.top_companies && analytics.top_companies.length > 0 ? (
                  analytics.top_companies.slice(0,3).map((company, index) => (
                    <div key={index} className="flex justify-between items-center" data-testid={`top-company-${index}`}>
                      <span className="text-sm font-medium">{company._id}</span>
                      <Badge variant="secondary">{company.count} internships</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Internships */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Internship Submissions</CardTitle>
            <CardDescription>Latest 10 internship applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">Student</th>
                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">Company</th>
                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">Duration</th>
                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">Mode</th>
                    <th className="text-left p-2 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {internships.slice(0, 10).map((internship, index) => (
                    <tr key={internship.id} className="border-b hover:bg-gray-50" data-testid={`internship-row-${index}`}>
                      <td className="p-2 text-sm">{internship.student_name}</td>
                      <td className="p-2 text-sm font-medium">{internship.company_name}</td>
                      <td className="p-2 text-sm">{internship.duration}</td>
                      <td className="p-2 text-sm">{internship.mode}</td>
                      <td className="p-2">
                        <Badge
                          className={
                            internship.status === "pending"
                              ? "bg-yellow-500"
                              : internship.status === "approved" || internship.status === "active"
                              ? "bg-green-500"
                              : internship.status === "rejected"
                              ? "bg-red-500"
                              : "bg-purple-500"
                          }
                        >
                          {internship.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {internships.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No internships found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
