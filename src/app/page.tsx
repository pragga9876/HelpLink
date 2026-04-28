import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Target, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Heart className="h-16 w-16 text-emerald-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            HelpLink
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Instead of overwhelming volunteers with large responsibilities, HelpLink breaks social work into small, actionable micro-tasks — making it easier for anyone to contribute instantly where help is needed most.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/register">
              <Button size="lg" className="text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Priority Scoring</h3>
            <p className="text-gray-600">Automatically identify and highlight the most urgent community needs</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Micro-Tasks</h3>
            <p className="text-gray-600">Break down big challenges into small, actionable tasks anyone can do</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Matching</h3>
            <p className="text-gray-600">Connect volunteers with opportunities matching their skills</p>
          </div>
        </div>
      </div>
    </div>
  );
}