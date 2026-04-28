"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";  // ← THIS WAS MISSING
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Award, MapPin, Heart } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [preferredLocation, setPreferredLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [myTasksCount, setMyTasksCount] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
      fetchMyTasks();
    }
  }, [session]);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/profile");
      const data = await response.json();
      if (data) {
        setProfile(data);
        setSelectedSkills(data.skills ? data.skills.split(",") : []);
        setPreferredLocation(data.preferredLocation || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  async function fetchMyTasks() {
    try {
      const response = await fetch("/api/microtasks");
      const tasks = await response.json();
      const myClaimed = tasks.filter((t: any) => t.volunteerId === session?.user?.id);
      setMyTasksCount(myClaimed.length);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: selectedSkills.join(","),
          preferredLocation: preferredLocation,
        }),
      });

      if (response.ok) {
        toast.success("Profile updated successfully! 🎉");
        await fetchProfile();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const availableSkills = [
    "Medical Aid",
    "Cooking/Distribution",
    "Teaching",
    "Logistics",
    "Verification",
    "Counseling",
    "First Aid",
    "Transportation"
  ];

  if (status === "loading") {
    return <div className="text-center py-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <User className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{session?.user?.name}</CardTitle>
                <CardDescription>{session?.user?.email}</CardDescription>
                <div className="flex items-center mt-1">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {session?.user?.role === "VOLUNTEER" ? "Volunteer" : "Reporter (NGO)"}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Link href="/microtasks">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Heart className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{myTasksCount}</div>
                  <p className="text-sm text-gray-600">Tasks Completed</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <Award className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{myTasksCount * 10}</div>
                <p className="text-sm text-gray-600">Impact Points</p>
              </div>
            </CardContent>
          </Card>
          <Link href="/reports?location=Howrah">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{preferredLocation || "Set location"}</div>
                  <p className="text-sm text-gray-600">Preferred Location</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Skills Selection Form */}
        <Card>
          <CardHeader>
            <CardTitle>Volunteer Profile</CardTitle>
            <CardDescription>
              Tell us about your skills and preferences to get matched with relevant tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Skills Selection */}
              <div className="space-y-3">
                <Label>Your Skills (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`p-2 text-sm rounded-lg border transition-all ${
                        selectedSkills.includes(skill)
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-emerald-400"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {selectedSkills.length > 0 && (
                  <p className="text-sm text-gray-600">
                    Selected: {selectedSkills.join(", ")}
                  </p>
                )}
              </div>

              {/* Preferred Location */}
              <div className="space-y-2">
                <Label htmlFor="preferredLocation">Preferred Location</Label>
                <Input
                  id="preferredLocation"
                  placeholder="e.g., Howrah, Kolkata, Mumbai"
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  We'll show you tasks in this area first
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* My Tasks Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>My Active Tasks</CardTitle>
            <CardDescription>Tasks you've claimed and are working on</CardDescription>
          </CardHeader>
          <CardContent>
            {myTasksCount > 0 ? (
              <Link href="/microtasks">
                <Button variant="outline" className="w-full">
                  View your {myTasksCount} active task{myTasksCount > 1 ? 's' : ''} →
                </Button>
              </Link>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No active tasks yet.</p>
                <Link href="/microtasks" className="text-emerald-600 hover:underline inline-block mt-2">
                  Browse available tasks →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}