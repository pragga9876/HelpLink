"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Heart, FileText, ListChecks, Users, TrendingUp, 
  AlertCircle, ArrowRight, Target, Zap, Award,
  MapPin, Clock, CheckCircle, Sparkles, HandHeart,
  Activity, Calendar, Bell, Star, Flame, Gift
} from "lucide-react";

interface Stats {
  totalReports: number;
  urgentNeeds: number;
  availableTasks: number;
  activeVolunteers: number;
  totalImpact: number;
  completionRate: number;
}

interface Report {
  id: string;
  problemType: string;
  location: string;
  description: string;
  priorityScore: number;
  severity: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  location: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ 
    totalReports: 0, urgentNeeds: 0, availableTasks: 0, 
    activeVolunteers: 12, totalImpact: 0, completionRate: 0 
  });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  async function fetchData() {
    try {
      const [reportsRes, tasksRes] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/microtasks")
      ]);
      
      let reports = [];
      let tasks = [];
      
      try {
        reports = await reportsRes.json();
        tasks = await tasksRes.json();
      } catch {
        reports = [];
        tasks = [];
      }
      
      const availableTasks = tasks.filter((t: any) => t.status === "AVAILABLE");
      const myClaimedTasks = tasks.filter((t: any) => t.volunteerId === session?.user?.id);
      const completedTasks = tasks.filter((t: any) => t.status === "COMPLETED");
      
      setStats({
        totalReports: reports.length || 0,
        urgentNeeds: reports.filter((r: any) => r.priorityScore >= 7).length || 0,
        availableTasks: availableTasks.length || 0,
        activeVolunteers: 24,
        totalImpact: myClaimedTasks.length + completedTasks.length,
        completionRate: completedTasks.length > 0 ? Math.round((completedTasks.length / (myClaimedTasks.length + completedTasks.length)) * 100) : 0
      });
      
      setRecentReports(reports.slice(0, 4) || []);
      setMyTasks(myClaimedTasks || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isVolunteer = session?.user?.role === "VOLUNTEER";
  const isReporter = session?.user?.role === "REPORTER";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      
      {/* Animated Hero Banner */}
      <div className="relative bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse animation-delay-500"></div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-10 right-20 animate-float">
          <Sparkles className="h-8 w-8 text-white/30" />
        </div>
        <div className="absolute bottom-10 left-20 animate-float animation-delay-300">
          <Heart className="h-8 w-8 text-white/30" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm animate-bounce-slow">
                <HandHeart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {greeting}, {session?.user?.name?.split(" ")[0]}!
                </h1>
                <p className="text-emerald-100 flex items-center gap-2 mt-1">
                  <Activity className="h-4 w-4" />
                  Here's your impact summary for today
                </p>
              </div>
            </div>
            
            {/* Impact Badge */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
              <div className="text-2xl font-bold">{stats.totalImpact}</div>
              <div className="text-xs text-emerald-100">Total Impact Points</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Grid with Icons & Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Link href="/reports">
            <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-400">Total</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalReports}</div>
              <div className="text-xs text-gray-500">Community Reports</div>
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(stats.totalReports / 10 * 100, 100)}%` }}></div>
              </div>
            </div>
          </Link>
          
          <Link href="/reports?filter=urgent">
            <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-400">Urgent</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.urgentNeeds}</div>
              <div className="text-xs text-gray-500">High Priority Issues</div>
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: `${(stats.urgentNeeds / Math.max(stats.totalReports, 1)) * 100}%` }}></div>
              </div>
            </div>
          </Link>
          
          <Link href="/microtasks">
            <div className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer group border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <ListChecks className="h-5 w-5 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="text-xs text-gray-400">Available</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">{stats.availableTasks}</div>
              <div className="text-xs text-gray-500">Tasks to Claim</div>
              <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(stats.availableTasks / 20 * 100, 100)}%` }}></div>
              </div>
            </div>
          </Link>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm group border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-gray-400">Active</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.activeVolunteers}</div>
            <div className="text-xs text-gray-500">Active Volunteers</div>
            <div className="mt-2 flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-purple-100 rounded-full border-2 border-white flex items-center justify-center">
                  <Heart className="h-3 w-3 text-purple-500" />
                </div>
              ))}
              <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-500">
                +{stats.activeVolunteers - 3}
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white shadow-sm group">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-emerald-200">Impact</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalImpact}</div>
            <div className="text-xs text-emerald-100">Impact Points Earned</div>
            <div className="mt-2 flex items-center gap-1">
              <Flame className="h-3 w-3" />
              <span className="text-xs">Keep going!</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-white shadow-sm group">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 group-hover:scale-110 transition-transform" />
              <span className="text-xs text-orange-200">Rate</span>
            </div>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <div className="text-xs text-orange-100">Completion Rate</div>
            <div className="mt-2 h-1 w-full bg-orange-400/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${stats.completionRate}%` }}></div>
            </div>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {isVolunteer && (
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl shadow-lg group cursor-pointer" onClick={() => router.push("/microtasks")}>
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <HandHeart className="h-8 w-8 mb-3" />
                    <h3 className="text-xl font-semibold">Ready to Help?</h3>
                    <p className="text-emerald-100 text-sm mt-1">Browse available tasks in your area</p>
                    <Button className="mt-4 bg-white text-emerald-700 hover:bg-gray-100">
                      Find Tasks <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <Target className="h-16 w-16 opacity-20 hidden md:block" />
                </div>
              </div>
            </div>
          )}
          
          {isReporter && (
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg group cursor-pointer" onClick={() => router.push("/reports/new")}>
              <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <div className="relative p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <AlertCircle className="h-8 w-8 mb-3" />
                    <h3 className="text-xl font-semibold">Report a Need</h3>
                    <p className="text-blue-100 text-sm mt-1">Submit a new community requirement</p>
                    <Button className="mt-4 bg-white text-blue-700 hover:bg-gray-100">
                      New Report <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <FileText className="h-16 w-16 opacity-20 hidden md:block" />
                </div>
              </div>
            </div>
          )}

          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl shadow-lg group cursor-pointer" onClick={() => router.push("/profile")}>
            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="relative p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <Users className="h-8 w-8 mb-3" />
                  <h3 className="text-xl font-semibold">Your Profile</h3>
                  <p className="text-purple-100 text-sm mt-1">Update skills and preferences</p>
                  <Button className="mt-4 bg-white text-purple-700 hover:bg-gray-100">
                    View Profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <Award className="h-16 w-16 opacity-20 hidden md:block" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Priority Heatmap */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  Priority Heatmap
                </CardTitle>
                <CardDescription>Most urgent needs by location</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/reports?location=Howrah">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          Howrah
                        </span>
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                          Critical
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">High density of urgent needs</p>
                      <div className="w-full bg-red-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full transition-all duration-1000" style={{ width: "85%" }}></div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span>🔥 3 active reports</span>
                        <span>📋 5 micro-tasks</span>
                      </div>
                    </div>
                  </Link>
                  <Link href="/reports?location=Kolkata">
                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-5 hover:shadow-lg transition-all cursor-pointer group">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-orange-500" />
                          Kolkata
                        </span>
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          High
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Growing number of requests</p>
                      <div className="w-full bg-orange-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full transition-all duration-1000" style={{ width: "60%" }}></div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                        <span>📋 2 active reports</span>
                        <span>✅ 3 micro-tasks</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Tasks Section */}
          <div>
            <Card className="border-none shadow-md h-full">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  My Active Tasks
                </CardTitle>
                <CardDescription>Tasks you're working on</CardDescription>
              </CardHeader>
              <CardContent>
                {myTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <ListChecks className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No active tasks yet</p>
                    <Link href="/microtasks">
                      <Button variant="link" className="text-emerald-600 mt-2">
                        Browse available tasks →
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myTasks.map((task: any, idx: number) => (
                      <div key={task.id} className="bg-emerald-50 rounded-xl p-4 hover:shadow-md transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{task.title}</h4>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {task.location}
                              </span>
                              <span className="text-xs bg-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full">
                                {task.status}
                              </span>
                            </div>
                          </div>
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="mt-8">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Recent Reports
                </CardTitle>
                <CardDescription>Latest community needs</CardDescription>
              </div>
              <Link href="/reports">
                <Button variant="ghost" size="sm" className="text-emerald-600">
                  View all <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No reports yet. Check back later!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentReports.map((report, idx) => (
                    <Link href={`/reports/${report.id}`} key={report.id}>
                      <div className="border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer bg-white animate-fade-in-up group" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="flex justify-between items-start mb-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.priorityScore >= 7 ? "bg-red-100 text-red-700" :
                            report.priorityScore >= 4 ? "bg-orange-100 text-orange-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            Priority {report.priorityScore}
                          </div>
                          <Calendar className="h-3 w-3 text-gray-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{report.problemType}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                          <MapPin className="h-3 w-3" />
                          {report.location}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex -space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-5 h-5 bg-emerald-100 rounded-full border border-white flex items-center justify-center">
                                <Heart className="h-2 w-2 text-emerald-500" />
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">+ responding</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Motivational Banner */}
        <div className="mt-8 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-full p-3 animate-bounce-slow">
                <Star className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-semibold">You're making a difference!</p>
                <p className="text-emerald-100 text-sm">Every micro-task completed brings us closer to our goal</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-yellow-300" />
              <span className="font-bold">{stats.totalImpact} impact points earned</span>
              <Gift className="h-5 w-5 text-yellow-300 ml-2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}