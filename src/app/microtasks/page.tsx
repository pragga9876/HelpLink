"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface MicroTask {
  id: string;
  title: string;
  description: string;
  status: string;
  location: string;
  reportId: string;
  volunteerId?: string;
}

export default function MicroTasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<MicroTask[]>([]);
  const [myTasks, setMyTasks] = useState<MicroTask[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchTasks();
    }
  }, [session]);

  async function fetchTasks() {
    try {
      const res = await fetch("/api/microtasks");
      const data = await res.json();
      setTasks(data.filter((t: MicroTask) => t.status === "AVAILABLE"));
      setMyTasks(data.filter((t: MicroTask) => t.volunteerId === session?.user?.id));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async function claimTask(taskId: string) {
    try {
      const response = await fetch(`/api/microtasks/${taskId}/claim`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success("Task claimed successfully!");
        fetchTasks();
      } else {
        toast.error("Failed to claim task");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  if (status === "loading") {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Micro-Tasks</h1>
          <p className="text-gray-600 mt-2">Small actions, big impact</p>
        </div>

        {/* My Tasks Section */}
        {myTasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <Badge>{task.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-2">{task.description}</p>
                    <p className="text-sm text-gray-500">Location: {task.location}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Tasks Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Available Tasks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-gray-500">
                  No available tasks at the moment
                </CardContent>
              </Card>
            ) : (
              tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-2">{task.description}</p>
                    <p className="text-sm text-gray-500 mb-4">Location: {task.location}</p>
                    <Button onClick={() => claimTask(task.id)} variant="outline" className="w-full">
                      Claim This Task
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}