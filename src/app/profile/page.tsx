"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  User, MapPin, Heart, Save, Camera, Sparkles, 
  Award, Clock, CheckCircle, Target, Mail, Calendar
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [preferredLocation, setPreferredLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchProfile();
      // Try to load saved profile image from localStorage
      const savedImage = localStorage.getItem(`profile_image_${session.user.id}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [session]);

  async function fetchProfile() {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setSelectedSkills(data.skills ? data.skills.split(",").filter((s: string) => s) : []);
        setPreferredLocation(data.preferredLocation || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
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

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully! 🎉");
        await fetchProfile();
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        if (session?.user?.id) {
          localStorage.setItem(`profile_image_${session.user.id}`, imageData);
        }
        toast.success("Profile picture updated!");
      };
      reader.readAsDataURL(file);
    }
  };

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-emerald-700 to-emerald-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4">
            <Sparkles className="h-8 w-8" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Your Profile</h1>
              <p className="text-emerald-100">Manage your skills and preferences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 h-24"></div>
              <CardContent className="pt-0 text-center">
                <div className="relative -mt-12 mb-4">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg mx-auto">
                      {profileImage ? (
                        <img 
                          src={profileImage} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                          <User className="h-10 w-10 text-white" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-emerald-600 rounded-full p-1.5 shadow-lg hover:bg-emerald-700 transition-colors"
                    >
                      <Camera className="h-3 w-3 text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900">{session?.user?.name}</h2>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                  <Mail className="h-3 w-3" />
                  {session?.user?.email}
                </p>
                <div className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  {session?.user?.role === "VOLUNTEER" ? "Volunteer" : "NGO Reporter"}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-around">
                    <div className="text-center">
                      <Heart className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900">0</div>
                      <div className="text-xs text-gray-500">Tasks Completed</div>
                    </div>
                    <div className="text-center">
                      <Award className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900">0</div>
                      <div className="text-xs text-gray-500">Impact Points</div>
                    </div>
                    <div className="text-center">
                      <Calendar className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                      <div className="text-lg font-bold text-gray-900">New</div>
                      <div className="text-xs text-gray-500">Member Since</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="mt-6 border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Skills matched</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {selectedSkills.length} / {availableSkills.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(selectedSkills.length / availableSkills.length) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm text-gray-600">Profile completion</span>
                  <span className="text-sm font-semibold text-emerald-600">
                    {preferredLocation ? 75 : 50}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${preferredLocation ? 75 : 50}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Edit Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                  Volunteer Profile
                </CardTitle>
                <CardDescription>
                  Tell us about your skills and preferences to get matched with relevant tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit} className="space-y-8">
                  {/* Skills Selection */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Your Skills</Label>
                    <p className="text-sm text-gray-500 -mt-2">Select all that apply</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availableSkills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`p-3 text-sm rounded-xl border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                            selectedSkills.includes(skill)
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                              : "bg-white text-gray-700 border-gray-200 hover:border-emerald-400 hover:shadow-sm"
                          }`}
                        >
                          {selectedSkills.includes(skill) && <CheckCircle className="h-4 w-4" />}
                          {skill}
                        </button>
                      ))}
                    </div>
                    {selectedSkills.length > 0 && (
                      <div className="mt-3 p-3 bg-emerald-50 rounded-lg">
                        <p className="text-sm text-emerald-800">
                          ✓ Selected: {selectedSkills.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Preferred Location */}
                  <div className="space-y-3">
                    <Label htmlFor="preferredLocation" className="text-base font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      Preferred Location
                    </Label>
                    <Input
                      id="preferredLocation"
                      placeholder="e.g., Howrah, Kolkata, Mumbai"
                      value={preferredLocation}
                      onChange={(e) => setPreferredLocation(e.target.value)}
                      className="border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                    />
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      We'll show you tasks in this area first
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base"
                    disabled={isLoading}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Profile"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6 border-none shadow-md bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <Heart className="h-8 w-8 opacity-80" />
                    <div>
                      <h3 className="font-semibold">Ready to make an impact?</h3>
                      <p className="text-emerald-100 text-sm">Browse tasks that match your skills</p>
                    </div>
                  </div>
                  <Link href="/microtasks">
                    <Button variant="secondary" className="bg-white text-emerald-700 hover:bg-gray-100">
                      Find Tasks →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}