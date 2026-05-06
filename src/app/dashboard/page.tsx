"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  FileText, ListChecks, AlertCircle, MapPin, 
  ArrowRight, Clock, CheckCircle, PlusCircle
} from "lucide-react";

interface Stats {
  totalReports: number;
  urgentNeeds: number;
  availableTasks: number;
}

interface Report {
  id: string;
  problemType: string;
  location: string;
  description: string;
  priorityScore: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ totalReports: 0, urgentNeeds: 0, availableTasks: 0 });
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [locationStats, setLocationStats] = useState<{ name: string; count: number; avgPriority: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
      
      // Calculate stats from REAL data
      const urgentReports = reports.filter((r: any) => r.priorityScore >= 7);
      const availableTasks = tasks.filter((t: any) => t.status === "AVAILABLE");
      const myClaimedTasks = tasks.filter((t: any) => t.volunteerId === session?.user?.id);
      
      // Calculate location-based stats for heatmap
      const locationMap = new Map<string, { count: number; totalPriority: number }>();
      reports.forEach((report: any) => {
        const loc = report.location;
        if (locationMap.has(loc)) {
          const existing = locationMap.get(loc)!;
          locationMap.set(loc, { 
            count: existing.count + 1, 
            totalPriority: existing.totalPriority + report.priorityScore 
          });
        } else {
          locationMap.set(loc, { count: 1, totalPriority: report.priorityScore });
        }
      });
      
      const locationArray = Array.from(locationMap.entries()).map(([name, data]) => ({
        name,
        count: data.count,
        avgPriority: Math.round(data.totalPriority / data.count)
      })).sort((a, b) => b.avgPriority - a.avgPriority);
      
      setStats({
        totalReports: reports.length,
        urgentNeeds: urgentReports.length,
        availableTasks: availableTasks.length
      });
      
      setRecentReports(reports.slice(0, 4));
      setMyTasks(myClaimedTasks);
      setLocationStats(locationArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const isVolunteer = session?.user?.role === "VOLUNTEER";
  const isReporter = session?.user?.role === "REPORTER";

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Helper to get color based on priority
  const getPriorityColor = (avgPriority: number) => {
    if (avgPriority >= 7) return "bg-red-500";
    if (avgPriority >= 4) return "bg-orange-500";
    return "bg-green-500";
  };

  const getPriorityText = (avgPriority: number) => {
    if (avgPriority >= 7) return "Critical";
    if (avgPriority >= 4) return "High";
    return "Normal";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {session?.user?.name?.split(" ")[0] || "User"}!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Stats Row - Simple 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Reports</p>
                  <p className="text-2xl font-bold">{stats.totalReports}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Urgent Needs</p>
                  <p className="text-2xl font-bold text-red-600">{stats.urgentNeeds}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
          
          <Link href="/microtasks">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Available Tasks</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.availableTasks}</p>
                  </div>
                  <ListChecks className="h-8 w-8 text-emerald-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {isVolunteer && (
            <Link href="/microtasks">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 h-12">
                <ListChecks className="mr-2 h-4 w-4" />
                Browse Available Tasks
              </Button>
            </Link>
          )}
          
          {isReporter && (
            <Link href="/reports/new">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 h-12">
                <PlusCircle className="mr-2 h-4 w-4" />
                Submit New Report
              </Button>
            </Link>
          )}
          
          <Link href="/profile">
            <Button variant="outline" className="w-full h-12">
              Update Your Profile
            </Button>
          </Link>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Location Heatmap - SIMPLE & USEFUL */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Needs by Location
              </CardTitle>
              <CardDescription>Areas with most reported needs</CardDescription>
            </CardHeader>
            <CardContent>
              {locationStats.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No reports yet.</p>
                  {isReporter && (
                    <Link href="/reports/new">
                      <Button variant="link" className="text-emerald-600 mt-2">
                        Submit the first report →
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {locationStats.map((loc) => (
                    <Link href={`/reports?location=${encodeURIComponent(loc.name)}`} key={loc.name}>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{loc.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getPriorityColor(loc.avgPriority)}`}>
                              {getPriorityText(loc.avgPriority)}
                            </span>
                          </div>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span>{loc.count} report{loc.count !== 1 ? 's' : ''}</span>
                            <span>Priority: {loc.avgPriority}/10</span>
                          </div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${getPriorityColor(loc.avgPriority)}`}
                              style={{ width: `${(loc.avgPriority / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400 ml-3" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* My Active Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                My Active Tasks
              </CardTitle>
              <CardDescription>Tasks you've claimed</CardDescription>
            </CardHeader>
            <CardContent>
              {myTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No active tasks yet.</p>
                  {isVolunteer && (
                    <Link href="/microtasks">
                      <Button variant="link" className="text-emerald-600 mt-2">
                        Browse available tasks →
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {myTasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                          <p className="text-sm text-gray-500 mt-1">{task.location}</p>
                        </div>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                          {task.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports - Full Width */}
        <div className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Reports</CardTitle>
                <CardDescription>Latest community needs</CardDescription>
              </div>
              <Link href="/reports">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No reports yet.</p>
                  {isReporter && (
                    <Link href="/reports/new">
                      <Button variant="link" className="text-emerald-600 mt-2">
                        Create the first report →
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <Link href={`/reports/${report.id}`} key={report.id}>
                      <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">{report.problemType}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                report.priorityScore >= 7 ? "bg-red-100 text-red-700" :
                                report.priorityScore >= 4 ? "bg-orange-100 text-orange-700" :
                                "bg-green-100 text-green-700"
                              }`}>
                                Priority {report.priorityScore}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {report.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(report.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 ml-3 flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}