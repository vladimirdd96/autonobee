"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import { MeteorEffect } from "@/components/aceternity/meteor-effect";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { AuroraBackground } from "@/components/aceternity/aurora-background";

// Mock data for charts and analytics
const performanceData = {
  views: [1200, 1800, 1500, 2200, 2500, 2100, 2800],
  engagement: [15, 20, 18, 25, 30, 27, 34],
  conversions: [5, 8, 7, 12, 14, 10, 18],
  weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
};

const contentPerformance = [
  {
    title: "How AI is Transforming Content Creation",
    views: 1240,
    engagement: 32,
    conversions: 15,
    trend: "up"
  },
  {
    title: "5 Ways to Optimize Your Content Strategy",
    views: 950,
    engagement: 28,
    conversions: 12,
    trend: "up"
  },
  {
    title: "The Future of Digital Marketing",
    views: 820,
    engagement: 19,
    conversions: 8,
    trend: "down"
  },
  {
    title: "Content Personalization Strategies",
    views: 1100,
    engagement: 24,
    conversions: 10,
    trend: "up"
  },
  {
    title: "Emerging Social Media Trends for 2024",
    views: 780,
    engagement: 21,
    conversions: 6,
    trend: "down"
  }
];

const audienceData = {
  demographics: [
    { name: "18-24", value: 15 },
    { name: "25-34", value: 30 },
    { name: "35-44", value: 25 },
    { name: "45-54", value: 18 },
    { name: "55+", value: 12 }
  ],
  platforms: [
    { name: "Mobile", value: 65 },
    { name: "Desktop", value: 30 },
    { name: "Tablet", value: 5 }
  ],
  sources: [
    { name: "Social Media", value: 40 },
    { name: "Direct", value: 25 },
    { name: "Search", value: 20 },
    { name: "Referral", value: 10 },
    { name: "Email", value: 5 }
  ]
};

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background pt-16 overflow-hidden">
      <MeteorEffect count={10} color="#f9b72d" className="z-0" />
      <Sidebar />
      <div className="ml-64 p-6 pt-8 relative z-10">
        <h1 className="text-3xl font-bold mb-6">
          <AnimatedGradientText text="Analytics Dashboard" />
        </h1>

        {/* Performance Overview */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-accent">Performance Overview</h2>
          <AuroraBackground 
            className="rounded-xl py-6 px-4"
            position={{ x: 0, y: 0 }}
            primaryColor="hsl(47, 100%, 50%)"
            secondaryColor="hsl(0, 0%, 80%)"
            size="40%"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HoverGlowEffect>
                <div className="relative perspective-1000">
                  <div className="bg-background/30 backdrop-blur-sm p-4 rounded-xl border border-primary/10">
                    <div className="w-full">
                      <div className="text-center">
                        <h3 className="text-accent/70 text-sm mb-1">Total Content Views</h3>
                        <p className="text-3xl font-bold text-accent">{performanceData.views.reduce((a, b) => a + b, 0).toLocaleString()}</p>
                        <div className="mt-4 h-20 flex items-end justify-between">
                          {performanceData.views.map((view, i) => (
                            <div
                              key={i}
                              className="w-[8%] bg-primary/70 rounded-t-sm"
                              style={{ height: `${(view / 3000) * 100}%` }}
                              title={`${performanceData.weekDays[i]}: ${view} views`}
                            ></div>
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-accent/50">
                          {performanceData.weekDays.map(day => (
                            <span key={day}>{day}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </HoverGlowEffect>

              <HoverGlowEffect>
                <div className="relative perspective-1000">
                  <div className="bg-background/30 backdrop-blur-sm p-4 rounded-xl border border-primary/10">
                    <div className="w-full">
                      <div className="text-center">
                        <h3 className="text-accent/70 text-sm mb-1">Engagement Rate</h3>
                        <p className="text-3xl font-bold text-accent">
                          {Math.round(performanceData.engagement.reduce((a, b) => a + b, 0) / performanceData.engagement.length)}%
                        </p>
                        <div className="mt-4 h-20 flex items-end justify-between">
                          {performanceData.engagement.map((rate, i) => (
                            <div
                              key={i}
                              className="w-[8%] bg-accent/70 rounded-t-sm"
                              style={{ height: `${(rate / 40) * 100}%` }}
                              title={`${performanceData.weekDays[i]}: ${rate}%`}
                            ></div>
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-accent/50">
                          {performanceData.weekDays.map(day => (
                            <span key={day}>{day}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </HoverGlowEffect>

              <HoverGlowEffect>
                <div className="relative perspective-1000">
                  <div className="bg-background/30 backdrop-blur-sm p-4 rounded-xl border border-primary/10">
                    <div className="w-full">
                      <div className="text-center">
                        <h3 className="text-accent/70 text-sm mb-1">Conversion Rate</h3>
                        <p className="text-3xl font-bold text-accent">
                          {Math.round(performanceData.conversions.reduce((a, b) => a + b, 0) / performanceData.conversions.length)}%
                        </p>
                        <div className="mt-4 h-20 flex items-end justify-between">
                          {performanceData.conversions.map((rate, i) => (
                            <div
                              key={i}
                              className="w-[8%] bg-green-500/70 rounded-t-sm"
                              style={{ height: `${(rate / 20) * 100}%` }}
                              title={`${performanceData.weekDays[i]}: ${rate}%`}
                            ></div>
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-accent/50">
                          {performanceData.weekDays.map(day => (
                            <span key={day}>{day}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </HoverGlowEffect>
            </div>
          </AuroraBackground>
        </section>

        {/* Content Performance */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-accent">Content Performance</h2>
          <div className="bg-grayDark/50 backdrop-blur-sm p-4 rounded-xl border border-accent/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-accent/70 border-b border-accent/20">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4 text-right">Views</th>
                    <th className="py-3 px-4 text-right">Engagement</th>
                    <th className="py-3 px-4 text-right">Conversions</th>
                    <th className="py-3 px-4 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="text-accent/90 divide-y divide-accent/10">
                  {contentPerformance.map((content, index) => (
                    <tr key={index} className="hover:bg-accent/5 transition-colors">
                      <td className="py-3 px-4">{content.title}</td>
                      <td className="py-3 px-4 text-right">{content.views.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{content.engagement}%</td>
                      <td className="py-3 px-4 text-right">{content.conversions}%</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          content.trend === "up" 
                            ? "bg-green-500/20 text-green-500" 
                            : "bg-red-500/20 text-red-500"
                        }`}>
                          {content.trend === "up" ? "↑ Up" : "↓ Down"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Audience Insights */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-accent">Audience Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Demographics */}
            <HoverGlowEffect>
              <div className="relative perspective-1000">
                <div className="bg-background/20 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
                  <div className="w-full">
                    <h3 className="text-lg font-medium text-accent mb-4">Age Demographics</h3>
                    <div className="space-y-3">
                      {audienceData.demographics.map(item => (
                        <div key={item.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-accent/70">{item.name}</span>
                            <span className="text-accent">{item.value}%</span>
                          </div>
                          <div className="w-full bg-accent/10 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </HoverGlowEffect>

            {/* Platforms */}
            <HoverGlowEffect>
              <div className="relative perspective-1000">
                <div className="bg-background/20 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
                  <div className="w-full">
                    <h3 className="text-lg font-medium text-accent mb-4">Platform Distribution</h3>
                    <div className="space-y-3">
                      {audienceData.platforms.map(item => (
                        <div key={item.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-accent/70">{item.name}</span>
                            <span className="text-accent">{item.value}%</span>
                          </div>
                          <div className="w-full bg-accent/10 rounded-full h-2">
                            <div 
                              className="bg-accent h-2 rounded-full" 
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </HoverGlowEffect>

            {/* Traffic Sources */}
            <HoverGlowEffect>
              <div className="relative perspective-1000">
                <div className="bg-background/20 backdrop-blur-sm p-4 rounded-xl border border-primary/10 h-full">
                  <div className="w-full">
                    <h3 className="text-lg font-medium text-accent mb-4">Traffic Sources</h3>
                    <div className="space-y-3">
                      {audienceData.sources.map(item => (
                        <div key={item.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-accent/70">{item.name}</span>
                            <span className="text-accent">{item.value}%</span>
                          </div>
                          <div className="w-full bg-green-500 h-2 rounded-full" 
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </HoverGlowEffect>
          </div>
        </section>

        {/* Action buttons */}
        <section>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors text-sm font-medium">
              Download Full Report
            </button>
            <button className="px-4 py-2 bg-accent/10 text-accent rounded-md hover:bg-accent/20 transition-colors text-sm font-medium">
              Schedule Weekly Report
            </button>
            <button className="px-4 py-2 bg-accent/10 text-accent rounded-md hover:bg-accent/20 transition-colors text-sm font-medium">
              Share Insights
            </button>
          </div>
        </section>
      </div>
    </div>
  );
} 