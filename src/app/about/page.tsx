import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Target, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Heart className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About HelpLink</h1>
          <p className="text-xl text-gray-600">
            Instead of overwhelming volunteers with large responsibilities, HelpLink breaks social work into small, 
            actionable micro-tasks — making it easier for anyone to contribute instantly where help is needed most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-emerald-600 mb-2" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To democratize social impact by making volunteering accessible to everyone, regardless of time or resources.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-emerald-600 mb-2" />
              <CardTitle>Our Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Breaking down complex social challenges into manageable micro-tasks that anyone can complete.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Report Needs</h3>
              <p className="text-gray-600">NGOs and field workers submit community needs with priority scoring.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Break Down Tasks</h3>
              <p className="text-gray-600">Large needs are broken into small, actionable micro-tasks.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Match Volunteers</h3>
              <p className="text-gray-600">Volunteers find tasks matching their skills and location.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4. Create Impact</h3>
              <p className="text-gray-600">Complete micro-tasks and track your community impact.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}