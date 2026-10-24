import { useState } from "react";
import { api } from "../App";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { GraduationCap, Users, Shield } from "lucide-react";

export default function Login({ onLogin }) {
  const [tab, setTab] = useState("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
    role: "student",
    department: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", loginData);
      toast.success("Login successful!");
      onLogin(res.data.user, res.data.access_token);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
    }

    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/register", registerData);
      toast.success("Registration successful! Please login.");

      setRegisterData({
        email: "",
        password: "",
        name: "",
        role: "student",
        department: "",
      });

      setTab("login"); // switch to login after register
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* LEFT HERO SECTION */}
        <div className="text-white space-y-6 hidden md:block">
          <h1 className="text-5xl font-bold">Student Internship Tracker</h1>
          <p className="text-xl opacity-90">
            Manage internships, track progress, and connect students with
            opportunities
          </p>

          <div className="space-y-4 mt-12">
            {[
              {
                icon: <GraduationCap className="w-6 h-6" />,
                title: "For Students",
                desc: "Submit internship details, track progress, and download certificates",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "For Faculty",
                desc: "Review submissions, approve internships, and monitor student progress",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "For Admins",
                desc: "Analytics, insights & complete system control",
              },
            ].map(({ icon, title, desc }, i) => (
              <div
                key={i}
                className="flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="bg-white/20 p-3 rounded-full">{icon}</div>
                <div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <p className="text-sm opacity-80">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT AUTH CARD */}
        <Card className="w-full shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Login or create an account to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* ---------------- LOGIN TAB ---------------- */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <Button className="w-full" disabled={loading}>
                    {loading ? "Loading..." : "Login"}
                  </Button>

                </form>
              </TabsContent>

              {/* ---------------- REGISTER TAB ---------------- */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input

                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"

                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Select
                      value={registerData.role}
                      onValueChange={(value) =>
                        setRegisterData({
                          ...registerData,
                          role: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="faculty">Faculty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input
                      placeholder="Enter your department"
                      value={registerData.department}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          department: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
