"use client";

import Image from "next/image";
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
  TrendingUp,
  HandHeart,
  Shield,
  Globe,
  Lightbulb,
  Coffee,
  Calendar,
  MapPin
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      
      {/* Hero Section - Same as Landing Page */}
      <div className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-50 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-60 left-1/4 w-64 h-64 bg-yellow-200 rounded-full opacity-10 animate-float"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Our Story
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-slide-up">
              Making Social Impact
              <span className="block bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mt-2">
                Accessible to Everyone
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
              HelpLink was born from a simple idea: what if volunteering didn't require weeks of commitment? 
              What if anyone could help, anytime, with just a few hours to spare?
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section with Image */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Target className="h-4 w-4" />
                Our Purpose
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Mission & Vision
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-xl p-3">
                      <Target className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Mission</h3>
                      <p className="text-gray-600 leading-relaxed">
                        To democratize social impact by breaking down complex community needs into 
                        small, actionable micro-tasks that anyone can complete, regardless of their 
                        available time or resources.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-xl p-3">
                      <Globe className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Vision</h3>
                      <p className="text-gray-600 leading-relaxed">
                        A world where every person has the opportunity to contribute to positive 
                        social change, and every community need finds its volunteer match within hours, 
                        not weeks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-float">
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-1 shadow-2xl">
                <div className="relative h-96 w-full rounded-3xl overflow-hidden">
                  <Image
                    src="/images/volunteer-hero.jpg"
                    alt="Volunteers helping community"
                    fill
                    className="object-cover rounded-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent rounded-3xl"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <Heart className="h-8 w-8 mb-2" />
                    <p className="text-lg font-semibold">"Small acts, when multiplied by millions, can transform the world."</p>
                    <p className="text-sm text-emerald-200 mt-1">— HelpLink Philosophy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Problem We Solve */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Lightbulb className="h-4 w-4" />
              The Challenge
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Traditional Volunteering Fails
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We identified critical gaps in how volunteers connect with community needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Large Time Commitment", desc: "Traditional roles require weeks or months, excluding busy professionals and students.", icon: Clock, color: "bg-orange-100", iconColor: "text-orange-600" },
              { title: "No Priority System", desc: "Urgent needs get lost among less critical requests. No intelligent prioritization.", icon: TrendingUp, color: "bg-red-100", iconColor: "text-red-600" },
              { title: "Skill Mismatches", desc: "Volunteers assigned to tasks that don't match their expertise or interests.", icon: Users, color: "bg-blue-100", iconColor: "text-blue-600" },
              { title: "Location Confusion", desc: "Volunteers don't know where help is needed most in their area.", icon: MapPin, color: "bg-purple-100", iconColor: "text-purple-600" },
              { title: "No Micro-Actions", desc: "People want to help but feel overwhelmed by large responsibilities.", icon: Coffee, color: "bg-yellow-100", iconColor: "text-yellow-600" },
              { title: "Delayed Response", desc: "Days or weeks pass before volunteers can respond to emerging needs.", icon: Calendar, color: "bg-pink-100", iconColor: "text-pink-600" }
            ].map((problem, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className={`${problem.color} rounded-xl w-14 h-14 flex items-center justify-center mb-4`}>
                  <problem.icon className={`h-7 w-7 ${problem.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{problem.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Solution with Images */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              The HelpLink Solution
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How We're Different
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A completely reimagined approach to volunteer coordination
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left column - Solutions with images */}
            <div className="space-y-8">
              {[
                { title: "Micro-Task Architecture", desc: "Break large problems into 1-3 hour tasks anyone can complete. Perfect for busy schedules.", icon: Target, image: "/images/food-distribution.jpg", stat: "2-3 hours" },
                { title: "Skill-Based Matching", desc: "Volunteers set skills and preferences. Get matched with relevant tasks automatically.", icon: Users, image: "/images/teaching.jpg", stat: "100% match" }
              ].map((solution, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-48 md:h-auto md:w-1/3">
                      <Image
                        src={solution.image}
                        alt={solution.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-emerald-100 rounded-xl p-2">
                          <solution.icon className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="text-emerald-600 font-bold text-sm">{solution.stat}</div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{solution.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{solution.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right column - Solutions with images */}
            <div className="space-y-8">
              {[
                { title: "Smart Priority Scoring", desc: "Medical emergencies score 5 points + location density + severity bonus. Urgent needs rise to the top.", icon: TrendingUp, image: "/images/medical-aid.jpg", stat: "9/10 priority" },
                { title: "Real-time Updates", desc: "Claim tasks instantly. Dashboard updates in real-time. See your impact immediately.", icon: Zap, image: "/images/shelter.jpg", stat: "Instant claim" }
              ].map((solution, idx) => (
                <div key={idx} className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative h-48 md:h-auto md:w-1/3">
                      <Image
                        src={solution.image}
                        alt={solution.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-emerald-100 rounded-xl p-2">
                          <solution.icon className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="text-emerald-600 font-bold text-sm">{solution.stat}</div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{solution.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{solution.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quote Section with Image */}
      <div className="relative bg-gradient-to-br from-emerald-700 to-emerald-800 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white rounded-full animate-pulse-slow animation-delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/teaching.jpg"
                alt="Community coming together"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-emerald-900/40"></div>
            </div>
            <div className="text-white">
              {/* Quote icon as SVG instead of missing import */}
              <div className="text-6xl text-emerald-300 mb-6">"</div>
              <p className="text-2xl md:text-3xl font-semibold leading-relaxed mb-6">
                Instead of overwhelming volunteers with large responsibilities, 
                HelpLink breaks social work into small, actionable micro-tasks — 
                making it easier for anyone to contribute instantly where help is needed most.
              </p>
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center">
                  <Heart className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold">The HelpLink Initiative</div>
                  <div className="text-sm text-emerald-200">Founded 2026 | Google Solution Challenge</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}