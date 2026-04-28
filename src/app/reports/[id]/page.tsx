"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, AlertCircle } from "lucide-react";

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (params.id) {
      fetchReport();
    }
  }, [params.id]);

  async function fetchReport() {
    try {
      const res = await fetch(`/api/reports/${params.id}`);
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  }

  if (status === "loading" || !report) {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/reports">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{report.problemType}</CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {report.location}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                report.priorityScore >= 7 ? "bg-red-100 text-red-800" :
                report.priorityScore >= 4 ? "bg-orange-100 text-orange-800" :
                "bg-green-100 text-green-800"
              }`}>
                Priority Score: {report.priorityScore}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{report.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Severity</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded text-sm ${
                report.severity === "HIGH" ? "bg-red-100 text-red-800" :
                report.severity === "MEDIUM" ? "bg-orange-100 text-orange-800" :
                "bg-green-100 text-green-800"
              }`}>
                <AlertCircle className="h-3 w-3 mr-1" />
                {report.severity}
              </span>
            </div>
            {report.contactInfo && (
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p className="text-gray-700">{report.contactInfo}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}