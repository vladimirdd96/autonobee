"use client";

import GatedSection from "@/components/GatedSection";
import Layout from "@/components/Layout";
import TrendBox from "@/components/TrendBox";
import { MeteorEffect } from "@/components/aceternity/meteor-effect";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { MovingBorder } from "@/components/aceternity/moving-border";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { SparklesCore } from "@/components/aceternity/sparkles";
import { CardContainer, CardBody } from "@/components/aceternity/3d-card";
import React from "react";

export default function Trends() {
  // Simulate wallet connection and token presence
  const hasToken = true; // Set to false to simulate restriction
  
  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] overflow-hidden">
        <div className="fixed top-0 left-0 right-0">
          <BackgroundBeams />
        </div>
        <MeteorEffect count={15} color="#f9b72d" className="z-0" />
        <div className="relative z-10">
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2">
              <AnimatedGradientText text="Trends & Analytics" />
            </h1>
            <div className="absolute -top-8 left-0 w-screen h-[100vh] pointer-events-none z-0">
              <div className="absolute top-0 left-0 w-full h-full">
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1}
                  particleDensity={200}
                  className="w-full h-full"
                  particleColor="#f9b72d"
                />
              </div>
            </div>
          </div>
          
          {/* Wallet Status */}
          <div className="flex justify-end my-6">
            {hasToken ? (
              <HoverGlowEffect>
                <div className="flex items-center bg-[#000000]/20 border border-[#f9b72d]/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-[#ffffff]">Advanced analytics unlocked</span>
                </div>
              </HoverGlowEffect>
            ) : (
              <MovingBorder
                borderRadius="0.5rem"
                className="p-0.5 bg-gradient-to-br from-[#f9b72d] via-[#f9b72d]/50 to-transparent"
              >
                <button className="px-4 py-2 bg-[#000000]/80 text-[#f9b72d] rounded-md hover:bg-[#000000]/60 transition-colors">
                  Connect Wallet
                </button>
              </MovingBorder>
            )}
          </div>
          
          {/* Basic analytics available to all users */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#ffffff] mb-4">Basic Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kpis.slice(0, 3).map((kpi, index) => (
                <HoverGlowEffect key={index}>
                  <div className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 p-4 rounded-lg">
                    <h3 className="text-xs text-[#cccccc]/70 mb-1">{kpi.title}</h3>
                    <p className="text-2xl font-bold text-[#ffffff] mb-1">{kpi.value}</p>
                    <div className="flex items-center">
                      <span className={`text-xs ${kpi.isIncreasing ? 'text-green-500' : 'text-red-500'}`}>
                        {kpi.isIncreasing ? '↑' : '↓'} {kpi.change}
                      </span>
                    </div>
                  </div>
                </HoverGlowEffect>
              ))}
            </div>
          </div>
          
          {/* Advanced analytics - token gated */}
          <GatedSection 
            hasAccess={hasToken}
            message="Connect your wallet with $FORGE tokens to access premium analytics and trends."
          >
            {/* Time Period Selector */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex space-x-2">
                {['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'].map((period) => (
                  <button 
                    key={period}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      period === 'Weekly' 
                        ? 'bg-[#f9b72d] text-[#000000]' 
                        : 'bg-[#000000]/30 text-[#ffffff] hover:bg-[#000000]/50 border border-[#f9b72d]/10'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <label className="text-[#cccccc]/70 text-sm">Date Range:</label>
                <input 
                  type="date" 
                  className="p-2 bg-[#000000]/30 border border-[#f9b72d]/20 rounded-lg text-[#ffffff] text-sm"
                  defaultValue="2024-03-01"
                />
                <span className="text-[#cccccc]/70">to</span>
                <input 
                  type="date" 
                  className="p-2 bg-[#000000]/30 border border-[#f9b72d]/20 rounded-lg text-[#ffffff] text-sm"
                  defaultValue="2024-03-24"
                />
              </div>
            </div>
            
            {/* All KPI Cards */}
            <h2 className="text-xl font-bold text-[#ffffff] mb-4">Detailed Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              {kpis.map((kpi, index) => (
                <CardContainer key={index} className="w-full">
                  <CardBody className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 p-4 rounded-lg">
                    <h3 className="text-xs text-[#cccccc]/70 mb-1">{kpi.title}</h3>
                    <p className="text-2xl font-bold text-[#ffffff] mb-1">{kpi.value}</p>
                    <div className="flex items-center">
                      <span className={`text-xs ${kpi.isIncreasing ? 'text-green-500' : 'text-red-500'}`}>
                        {kpi.isIncreasing ? '↑' : '↓'} {kpi.change}
                      </span>
                    </div>
                  </CardBody>
                </CardContainer>
              ))}
            </div>
            
            {/* Main Trends */}
            <h2 className="text-xl font-bold text-[#ffffff] mb-4">Key Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {keyTrends.map((trend, index) => (
                <HoverGlowEffect key={index}>
                  <TrendBox 
                    title={trend.title}
                    percentage={trend.percentage}
                    category={trend.category}
                    isIncreasing={trend.isIncreasing}
                  />
                </HoverGlowEffect>
              ))}
            </div>
            
            {/* Chart Placeholder */}
            <h2 className="text-xl font-bold text-[#ffffff] mb-4">Detailed Analytics</h2>
            <MovingBorder
              borderRadius="0.5rem"
              className="w-full p-1 bg-gradient-to-br from-[#f9b72d] via-[#f9b72d]/50 to-transparent mb-8"
            >
              <div className="bg-[#000000]/80 backdrop-blur-sm p-6 rounded-[0.4rem]">
                <div className="flex justify-between mb-6">
                  <h3 className="text-lg font-medium text-[#ffffff]">Usage Metrics Over Time</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-[#000000]/30 text-[#cccccc]/80 text-sm rounded hover:bg-[#000000]/40 border border-[#f9b72d]/10">
                      Content
                    </button>
                    <button className="px-3 py-1 bg-[#f9b72d]/20 text-[#f9b72d] text-sm rounded border border-[#f9b72d]/30">
                      Users
                    </button>
                    <button className="px-3 py-1 bg-[#000000]/30 text-[#cccccc]/80 text-sm rounded hover:bg-[#000000]/40 border border-[#f9b72d]/10">
                      Tokens
                    </button>
                  </div>
                </div>
                
                {/* Placeholder for chart */}
                <div className="w-full h-80 bg-[#000000]/30 rounded-lg flex items-center justify-center border border-[#f9b72d]/5">
                  <p className="text-[#cccccc]/60">Interactive chart will be displayed here.</p>
                </div>
              </div>
            </MovingBorder>
            
            {/* Popular Categories */}
            <h2 className="text-xl font-bold text-[#ffffff] mb-4">Popular Categories</h2>
            <AuroraBackground 
              className="rounded-xl py-6 px-4 mb-8"
              position={{ x: 0, y: 0 }}
              primaryColor="#f9b72d"
              secondaryColor="#cccccc"
              size="40%"
            >
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {categories.map((category, index) => (
                    <div key={index} className="bg-[#000000]/20 backdrop-blur-sm p-4 rounded-lg border border-[#ffffff]/10">
                      <h3 className="font-medium text-[#ffffff] mb-2">{category.name}</h3>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#cccccc]/70 text-sm">{category.percentage}% of total</span>
                        <span className="text-xs text-[#f9b72d] px-2 py-1 rounded bg-[#f9b72d]/10">
                          {category.status}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-[#000000]/40 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#f9b72d]" 
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AuroraBackground>
          </GatedSection>
        </div>
      </div>
    </Layout>
  );
}

const kpis = [
  { title: 'Total Users', value: '1,245', change: '12%', isIncreasing: true },
  { title: 'Active Bots', value: '312', change: '8%', isIncreasing: true },
  { title: 'Content Generated', value: '4,328', change: '15%', isIncreasing: true },
  { title: 'Avg. Engagement', value: '68%', change: '3%', isIncreasing: false },
  { title: 'Token Usage', value: '8.9M', change: '22%', isIncreasing: true },
];

const keyTrends = [
  { title: 'User Growth', percentage: 42, category: 'Users', isIncreasing: true },
  { title: 'Content Generation', percentage: 78, category: 'Activity', isIncreasing: true },
  { title: 'Bot Efficiency', percentage: 12, category: 'Performance', isIncreasing: true },
  { title: 'Response Quality', percentage: 8, category: 'Performance', isIncreasing: false },
];

const categories = [
  { name: 'Social Media Content', percentage: 45, status: 'Trending Up' },
  { name: 'Blog Posts', percentage: 30, status: 'Stable' },
  { name: 'Email Marketing', percentage: 25, status: 'New' },
]; 