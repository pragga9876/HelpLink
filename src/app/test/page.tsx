"use client";

import { useEffect, useState } from "react";

export default function TestPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/microtasks")
      .then(res => res.json())
      .then(data => {
        console.log("Tasks from API:", data);
        setTasks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test</h1>
      <p className="mb-4">Total tasks found: {tasks.length}</p>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(tasks, null, 2)}
      </pre>
    </div>
  );
}