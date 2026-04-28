"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface MicroTask {
  id: string;
  title: string;
  description: string;
  status: string;
  location: string;
  volunteerId?: string;
  report: {
    problemType: string;
    location: string;
  };
}

export default function MicroTasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [availableTasks, setAvailableTasks] = useState<MicroTask[]>([]);
  const [myTasks, setMyTasks] = useState<MicroTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks();
    }
  }, [session]);

  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await fetch("/api/microtasks");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Fetched tasks:", data);
      
      // Filter tasks based on status and volunteer
      const available = data.filter((t: MicroTask) => t.status === "AVAILABLE");
      const myClaimed = data.filter((t: MicroTask) => t.volunteerId === session?.user?.id);
      
      setAvailableTasks(available);
      setMyTasks(myClaimed);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  async function claimTask(taskId: string) {
    try {
      const response = await fetch(`/api/microtasks/${taskId}/claim`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Task claimed successfully! 🎉");
        fetchTasks(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to claim task");
      }
    } catch (error) {
      console.error("Error claiming task:", error);
      toast.error("Something went wrong");
    }
  }

  if (status === "loading") {
    return <div className="text-center py-20">Checking authentication...</div>;
  }

  if (loading) {
    return <div className="text-center py-20">Loading tasks...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Micro-Tasks</h1>
          <p className="text-gray-600 mt-2">Small actions, big impact - Claim tasks that match your skills</p>
        </div>

        {/* My Tasks Section */}
        {myTasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">📋 My Tasks ({myTasks.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                        {task.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-2">{task.description}</p>
                    <p className="text-sm text-gray-500">📍 Location: {task.location}</p>
                    <p className="text-sm text-gray-500">📂 Type: {task.report?.problemType || "N/A"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Tasks Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">✅ Available Tasks ({availableTasks.length})</h2>
          {availableTasks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No available tasks at the moment.</p>
                <p className="text-sm text-gray-400 mt-2">Check back later for new opportunities!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-2">{task.description}</p>
                    <p className="text-sm text-gray-500 mb-2">📍 Location: {task.location}</p>
                    <p className="text-sm text-gray-500 mb-4">📂 Category: {task.report?.problemType || "N/A"}</p>
                    <Button 
                      onClick={() => claimTask(task.id)} 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                    >
                      Claim This Task
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}