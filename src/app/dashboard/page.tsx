"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, ListChecks, AlertCircle, MapPin, 
  ArrowRight, PlusCircle, TrendingUp
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({ totalReports: 0, urgentNeeds: 0, availableTasks: 0 });
  const [reports, setReports] = useState<any[]>([]);
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
      
      let reportsData = [];
      let tasks = [];
      
      try {
        reportsData = await reportsRes.json();
        tasks = await tasksRes.json();
      } catch {
        reportsData = [];
        tasks = [];
      }
      
      const urgentReports = reportsData.filter((r: any) => r.priorityscore >= 7);
      const availableTasks = tasks.filter((t: any) => t.status === "AVAILABLE");
      
      setStats({
        totalReports: reportsData.length,
        urgentNeeds: urgentReports.length,
        availableTasks: availableTasks.length
      });
      
      setReports(reportsData);
      
      // Calculate location heatmap - groups reports by location
      const locationMap = new Map<string, { count: number; totalPriority: number }>();
      reportsData.forEach((report: any) => {
        const loc = report.location;
        if (locationMap.has(loc)) {
          const existing = locationMap.get(loc)!;
          locationMap.set(loc, { 
            count: existing.count + 1, 
            totalPriority: existing.totalPriority + (report.priorityscore || 0)
          });
        } else {
          locationMap.set(loc, { count: 1, totalPriority: report.priorityscore || 0 });
        }
      });
      
      const locationArray = Array.from(locationMap.entries()).map(([name, data]) => ({
        name,
        count: data.count,
        avgPriority: Math.round(data.totalPriority / data.count)
      })).sort((a, b) => b.avgPriority - a.avgPriority);
      
      setLocationStats(locationArray);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  const isReporter = session?.user?.role === "REPORTER";
  const isVolunteer = session?.user?.role === "VOLUNTEER";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {session?.user?.name?.split(" ")[0] || "User"}!</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {isReporter && (
            <Link href="/reports/new">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Submit New Report
              </Button>
            </Link>
          )}
          {isVolunteer && (
            <Link href="/microtasks">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <ListChecks className="mr-2 h-4 w-4" />
                Browse Available Tasks
              </Button>
            </Link>
          )}
          <Link href="/profile">
            <Button variant="outline" className="w-full">
              Update Your Profile
            </Button>
          </Link>
        </div>

        {/* HEATMAP SECTION - The Feature You Requested */}
        <Card className="border-none shadow-md mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Community Needs Heatmap
            </CardTitle>
            <CardDescription>
              {locationStats.length === 0 
                ? "No reports yet. Submit a report to see location-based heatmap." 
                : `Showing ${locationStats.length} location${locationStats.length !== 1 ? 's' : ''} with active needs`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {locationStats.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No reports yet</p>
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
                {locationStats.map((loc, idx) => {
                  const priorityLevel = loc.avgPriority >= 7 ? "Critical" : loc.avgPriority >= 4 ? "High" : "Normal";
                  const priorityColor = loc.avgPriority >= 7 ? "bg-red-500" : loc.avgPriority >= 4 ? "bg-orange-500" : "bg-green-500";
                  const bgColor = loc.avgPriority >= 7 ? "bg-red-50" : loc.avgPriority >= 4 ? "bg-orange-50" : "bg-green-50";
                  
                  return (
                    <Link href={`/reports?location=${encodeURIComponent(loc.name)}`} key={loc.name}>
                      <div className={`${bgColor} rounded-xl p-4 cursor-pointer hover:shadow-md transition-all`}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <MapPin className={`h-5 w-5 ${loc.avgPriority >= 7 ? "text-red-500" : loc.avgPriority >= 4 ? "text-orange-500" : "text-green-500"}`} />
                            <span className="font-semibold text-gray-900">{loc.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full text-white ${priorityColor}`}>
                              {priorityLevel}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{loc.count} report{loc.count !== 1 ? 's' : ''}</span>
                        </div>
                        
                        {/* Heat level progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full ${priorityColor}`}
                            style={{ width: `${(loc.avgPriority / 10) * 100}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>🔥 Priority Score: {loc.avgPriority}/10</span>
                          <span>📋 Active needs: {loc.count}</span>
                          <span className="flex items-center gap-1">
                            View details <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Reports</CardTitle>
              <CardDescription>Latest community needs</CardDescription>
            </div>
            <Link href="/reports">
              <Button variant="ghost" size="sm" className="text-emerald-600">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
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
                {reports.slice(0, 5).map((report) => (
                  <Link href={`/reports/${report.id}`} key={report.id}>
                    <div className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium text-gray-900">{report.problemtype || report.problemType}</span>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {report.location}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          (report.priorityscore || report.priorityScore) >= 7 ? "bg-red-100 text-red-700" :
                          (report.priorityscore || report.priorityScore) >= 4 ? "bg-orange-100 text-orange-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          Priority {(report.priorityscore || report.priorityScore)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{report.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}