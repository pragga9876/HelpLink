"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Target, 
  Users, 
  Zap, 
  ArrowRight,
  Sparkles,
  Clock,
  Award,
  TrendingUp,
  HandHeart,
  Shield,
  Globe
} from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    { icon: HandHeart, bg: "from-rose-500 to-rose-600", text: "Helping Hands" },
    { icon: Heart, bg: "from-emerald-500 to-emerald-600", text: "Community Care" },
    { icon: Users, bg: "from-blue-500 to-blue-600", text: "Together We Can" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = heroImages[currentImageIndex].icon;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-200 rounded-full opacity-10 animate-pulse delay-500"></div>
        
        {/* Floating elements */}
        <div className="absolute top-40 right-20 animate-bounce-slow">
          <div className="text-4xl">❤️</div>
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce-slow delay-300">
          <div className="text-4xl">🤝</div>
        </div>
        <div className="absolute top-60 left-1/4 animate-float">
          <div className="text-3xl">⭐</div>
        </div>
      </div>

      {/* Hero Section with Animated Icon */}
      <div className="relative min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
                <Sparkles className="h-4 w-4" />
                Google Solution Challenge 2026
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
                HelpLink
                <span className="block bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mt-2">
                  Small Tasks, Big Impact
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-slide-up animation-delay-200">
                Instead of overwhelming volunteers with large responsibilities, 
                HelpLink breaks social work into small, actionable micro-tasks — 
                making it easier for anyone to contribute instantly where help is needed most.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-400">
                <Link href="/register">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all">
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6 h-auto transition-all">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 animate-fade-in-up animation-delay-600">
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-emerald-50 transition-all">
                  <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">2-3 hrs</div>
                  <div className="text-xs text-gray-500">Average task time</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-emerald-50 transition-all">
                  <Award className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-xs text-gray-500">Skill-based matching</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-emerald-50 transition-all">
                  <TrendingUp className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">Real-time</div>
                  <div className="text-xs text-gray-500">Priority scoring</div>
                </div>
              </div>
            </div>

            {/* Right Column - Animated Hero Image */}
            <div className="relative animate-float">
              <div className={`relative w-80 h-80 mx-auto bg-gradient-to-br ${heroImages[currentImageIndex].bg} rounded-3xl shadow-2xl flex items-center justify-center transition-all duration-500 transform hover:scale-105`}>
                <CurrentIcon className="w-40 h-40 text-white opacity-90" />
                
                {/* Pulsing rings */}
                <div className="absolute inset-0 rounded-3xl border-4 border-white/30 animate-ping"></div>
                <div className="absolute inset-4 rounded-2xl border-4 border-white/20 animate-pulse"></div>
                
                {/* Text overlay */}
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-2 shadow-lg whitespace-nowrap">
                  <span className="text-gray-800 font-semibold">{heroImages[currentImageIndex].text}</span>
                </div>
              </div>
              
              {/* Floating dots around */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full animate-bounce-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-pink-400 rounded-full animate-bounce-slow delay-300"></div>
              <div className="absolute top-1/2 -right-8 w-6 h-6 bg-blue-400 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works - 4 Steps */}
      <div className="bg-gray-50 py-20 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How HelpLink Works
            </h2>
            <p className="text-xl text-gray-600">Four simple steps to make a real difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: "01", icon: HandHeart, title: "Report Needs", desc: "NGOs submit community needs with smart priority scoring", color: "from-rose-500 to-rose-600" },
              { num: "02", icon: Target, title: "Break Down", desc: "Large tasks split into small, actionable micro-tasks", color: "from-emerald-500 to-emerald-600" },
              { num: "03", icon: Users, title: "Claim & Do", desc: "Volunteers claim tasks matching their skills", color: "from-blue-500 to-blue-600" },
              { num: "04", icon: Award, title: "Create Impact", desc: "Track your contribution and see real impact", color: "from-purple-500 to-purple-600" }
            ].map((step, idx) => (
              <div key={idx} className="group text-center animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="relative mb-6">
                  <div className={`w-24 h-24 mx-auto bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md">
                    {step.num}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HelpLink?
            </h2>
            <p className="text-xl text-gray-600">We're reimagining volunteer coordination</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Smart Priority Scoring", desc: "Medical emergencies get top priority (5 points) + location density bonus + severity bonus for urgent needs.", color: "bg-orange-100", iconColor: "text-orange-600" },
              { icon: Target, title: "Micro-Task System", desc: "Break down big challenges into small tasks anyone can complete in 2-3 hours. Perfect for busy schedules.", color: "bg-emerald-100", iconColor: "text-emerald-600" },
              { icon: Shield, title: "Smart Matching", desc: "Connect with opportunities matching your unique skills and preferred locations. Get relevant tasks instantly.", color: "bg-blue-100", iconColor: "text-blue-600" }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={`${feature.color} rounded-xl w-14 h-14 flex items-center justify-center mb-5`}>
                  <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Stats with Counter Animation */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Impact So Far</h2>
          <p className="text-emerald-100 text-lg mb-12">Join hundreds of volunteers making a difference daily</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "500+", label: "Reports Processed", delay: 0 },
              { number: "1000+", label: "Tasks Completed", delay: 200 },
              { number: "200+", label: "Active Volunteers", delay: 400 }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 animate-fade-in-up hover:bg-white/20 transition-all" style={{ animationDelay: `${stat.delay}ms` }}>
                <div className="text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trusted Organizations */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted By Organizations</h2>
            <p className="text-gray-600">Partnering with leading NGOs to maximize impact</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Red Cross", type: "Partner NGO" },
              { name: "UNICEF", type: "Global Partner" },
              { name: "Care India", type: "Field Partner" },
              { name: "Goonj", type: "Implementation" }
            ].map((org, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <Globe className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
                <div className="font-semibold text-gray-900">{org.name}</div>
                <p className="text-xs text-gray-400 mt-1">{org.type}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA - Single button, no Learn More */}
      <div className="py-20 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-bounce-slow">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              Join the Movement
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-slide-up">
            Ready to Make a Difference?
          </h2>
          <p className="text-emerald-100 text-lg mb-8 animate-slide-up animation-delay-200">
            Join thousands of volunteers who are changing lives, one micro-task at a time.
          </p>
          <div className="animate-fade-in-up animation-delay-400">
            <Link href="/register">
              <Button size="lg" className="bg-white text-emerald-700 hover:bg-gray-100 text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all">
                Start Volunteering Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}