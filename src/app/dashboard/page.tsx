"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, FileText, ListChecks, Users, TrendingUp, AlertCircle, ArrowRight } from "lucide-react";

interface DashboardStats {
  totalReports: number;
  urgentNeeds: number;
  availableTasks: number;
  activeVolunteers: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 6,
    urgentNeeds: 3,
    availableTasks: 8,
    activeVolunteers: 12,
  });
  const [recentReports, setRecentReports] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchStats();
      fetchRecentReports();
    }
  }, [session]);

  async function fetchStats() {
    try {
      const [reportsRes, tasksRes] = await Promise.all([
        fetch("/api/reports"),
        fetch("/api/microtasks"),
      ]);
      const reports = await reportsRes.json();
      const tasks = await tasksRes.json();
      
      setStats({
        totalReports: reports.length || 6,
        urgentNeeds: reports.filter((r: any) => r.priorityScore >= 7).length || 3,
        availableTasks: tasks.filter((t: any) => t.status === "AVAILABLE").length || 8,
        activeVolunteers: 12,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  async function fetchRecentReports() {
    try {
      const res = await fetch("/api/reports?limit=5");
      const data = await res.json();
      setRecentReports(data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching recent reports:", error);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {session?.user?.name}!</p>
        </div>

        {/* Clickable Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/reports">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReports}</div>
                <p className="text-xs text-muted-foreground">Community needs reported</p>
                <ArrowRight className="h-4 w-4 mt-2 text-emerald-600" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/reports?filter=urgent">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Urgent Needs</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.urgentNeeds}</div>
                <p className="text-xs text-muted-foreground">High priority issues</p>
                <ArrowRight className="h-4 w-4 mt-2 text-emerald-600" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/microtasks">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Tasks</CardTitle>
                <ListChecks className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.availableTasks}</div>
                <p className="text-xs text-muted-foreground">Ready to claim</p>
                <ArrowRight className="h-4 w-4 mt-2 text-emerald-600" />
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/profile">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeVolunteers}</div>
                <p className="text-xs text-muted-foreground">Making impact</p>
                <ArrowRight className="h-4 w-4 mt-2 text-emerald-600" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Priority Heatmap Section - Clickable */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Priority Heatmap</CardTitle>
            <CardDescription>Most urgent needs by location - Click to view reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/reports?location=Howrah">
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Howrah</span>
                    <span className="text-red-600 bg-red-100 px-2 py-1 rounded text-sm">High Urgency</span>
                  </div>
                  <div className="text-sm text-gray-600">3 active reports • 5 micro-tasks</div>
                  <div className="mt-2 w-full bg-red-200 rounded-full h-2">
                    <div className="bg-red-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
              </Link>
              <Link href="/reports?location=Kolkata">
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Kolkata</span>
                    <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded text-sm">Medium Urgency</span>
                  </div>
                  <div className="text-sm text-gray-600">2 active reports • 3 micro-tasks</div>
                  <div className="mt-2 w-full bg-orange-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports - Clickable */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Latest community needs - Click to view details</CardDescription>
            </div>
            <Link href="/reports">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentReports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reports yet</p>
            ) : (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <Link href={`/reports/${report.id}`} key={report.id}>
                    <div className="border-b last:border-0 pb-4 last:pb-0 hover:bg-gray-50 p-3 rounded-lg transition-colors cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">{report.problemType}</h3>
                          <p className="text-sm text-gray-600">{report.location}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          report.priorityScore >= 7 ? "bg-red-100 text-red-800" :
                          report.priorityScore >= 4 ? "bg-orange-100 text-orange-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          Priority: {report.priorityScore}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{report.description.substring(0, 100)}...</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions for Volunteers */}
        {session?.user?.role === "VOLUNTEER" && (
          <Card className="mt-8 bg-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Ready to make an impact?</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Link href="/microtasks">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <ListChecks className="h-4 w-4 mr-2" />
                  Browse Available Tasks
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Update Your Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions for Reporters */}
        {session?.user?.role === "REPORTER" && (
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Report new community needs</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/reports/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Submit New Report
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}