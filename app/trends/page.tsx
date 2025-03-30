"use client";

import { useEffect, useState } from "react";
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

interface TrendData {
  name: string;
  url: string;
  tweet_volume: number | null;
  category: string;
}

interface KPIData {
  title: string;
  value: string;
  change: string;
  isIncreasing: boolean;
}

interface CategoryData {
  name: string;
  percentage: number;
  status: string;
}

export default function Trends() {
  // State
  const [hasToken, setHasToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [keyTrendsData, setKeyTrendsData] = useState<TrendData[]>([]);
  const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const res = await fetch('/api/x/auth/check');
        const data = await res.json();
        setHasToken(data.isAuthenticated);
      } catch (error) {
        console.error('Error checking auth status:', error);
      }
    }
    
    async function fetchTrends() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/x/trends/public');
        
        if (!res.ok) {
          throw new Error(`Failed to fetch trends: ${res.status}`);
        }
        
        const data = await res.json();
        
        if (data.trends) {
          setTrends(data.trends);
          
          // Transform trends data for visualization
          // Top trends as KPIs
          const topKpis = data.trends
            .filter((trend: TrendData) => trend.tweet_volume)
            .slice(0, 5)
            .map((trend: TrendData) => ({
              title: trend.name,
              value: trend.tweet_volume ? `${Math.floor(trend.tweet_volume / 1000)}K` : 'N/A',
              change: `${Math.floor(Math.random() * 30)}%`, // Replace with real data when available
              isIncreasing: Math.random() > 0.3, // Replace with real data when available
            }));
          setKpiData(topKpis);
          
          // Key trends based on tweet volume
          const keyTrendsTransformed = data.trends
            .filter((t: TrendData) => t.tweet_volume)
            .slice(0, 4);
          setKeyTrendsData(keyTrendsTransformed);
          
          // Categories based on trends
          const categoriesMap: {[key: string]: {count: number, volume: number}} = {};
          data.trends.forEach((trend: TrendData) => {
            const category = trend.category || 'Uncategorized';
            if (!categoriesMap[category]) {
              categoriesMap[category] = {
                count: 0,
                volume: 0
              };
            }
            categoriesMap[category].count += 1;
            categoriesMap[category].volume += trend.tweet_volume || 0;
          });
          
          const totalCount = data.trends.length;
          const categoriesArray = Object.entries(categoriesMap)
            .map(([name, data]) => ({
              name,
              percentage: Math.floor((data.count / totalCount) * 100),
              status: data.count > 5 ? 'Trending Up' : 'Stable'
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 3);
          
          setCategoriesData(categoriesArray);
        } else {
          setError('No trends data available');
        }
      } catch (error) {
        console.error('Error fetching trends:', error);
        setError('Failed to load trends');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuthStatus();
    fetchTrends();
  }, []);
  
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
              <AnimatedGradientText text="X.com Trends & Analytics" />
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
          
          {/* Auth Status */}
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
                <a href="/api/x/auth" className="block px-4 py-2 bg-[#000000]/80 text-[#f9b72d] rounded-md hover:bg-[#000000]/60 transition-colors">
                  Connect X Account
                </a>
              </MovingBorder>
            )}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg mb-6">
              <p className="text-red-200">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-300 hover:text-red-100"
              >
                Try again
              </button>
            </div>
          )}
          
          {/* Basic analytics available to all users */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#ffffff] mb-4">Top Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <HoverGlowEffect key={index}>
                    <div className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 p-4 rounded-lg h-24 animate-pulse">
                      <div className="h-4 bg-[#333333] rounded w-2/3 mb-2"></div>
                      <div className="h-8 bg-[#333333] rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-[#333333] rounded w-1/4"></div>
                    </div>
                  </HoverGlowEffect>
                ))
              ) : (
                kpiData.slice(0, 3).map((kpi, index) => (
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
                ))
              )}
            </div>
          </div>
          
          {/* Advanced analytics - token gated */}
          <GatedSection 
            hasAccess={hasToken}
            message="Connect your X account to access premium analytics and trends."
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
            <h2 className="text-xl font-bold text-[#ffffff] mb-4">Trending Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <CardContainer key={index} className="w-full">
                    <CardBody className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 p-4 rounded-lg h-24 animate-pulse">
                      <div className="h-4 bg-[#333333] rounded w-2/3 mb-2"></div>
                      <div className="h-8 bg-[#333333] rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-[#333333] rounded w-1/4"></div>
                    </CardBody>
                  </CardContainer>
                ))
              ) : (
                kpiData.map((kpi, index) => (
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
                ))
              )}
            </div>
            
            {/* Main Trends */}
            <h2 className="text-xl font-bold text-[#ffffff] mb-4">Key Trends</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <HoverGlowEffect key={index}>
                    <div className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 p-6 rounded-lg h-40 animate-pulse">
                      <div className="h-6 bg-[#333333] rounded w-2/3 mb-4"></div>
                      <div className="h-4 bg-[#333333] rounded w-1/3 mb-3"></div>
                      <div className="h-12 bg-[#333333] rounded w-full"></div>
                    </div>
                  </HoverGlowEffect>
                ))
              ) : (
                keyTrendsData.map((trend, index) => (
                  <HoverGlowEffect key={index}>
                    <TrendBox 
                      title={trend.name}
                      percentage={trend.tweet_volume ? Math.floor(trend.tweet_volume / 10000) : 0}
                      category={trend.category}
                      isIncreasing={true}
                    />
                  </HoverGlowEffect>
                ))
              )}
            </div>
            
            {/* Chart Placeholder */}
            <h2 className="text-xl font-bold text-[#ffffff] mb-4">Detailed Analytics</h2>
            <MovingBorder
              borderRadius="0.5rem"
              className="w-full p-1 bg-gradient-to-br from-[#f9b72d] via-[#f9b72d]/50 to-transparent mb-8"
            >
              <div className="bg-[#000000]/80 backdrop-blur-sm p-6 rounded-[0.4rem]">
                <div className="flex justify-between mb-6">
                  <h3 className="text-lg font-medium text-[#ffffff]">Tweet Volume Over Time</h3>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-[#000000]/30 text-[#cccccc]/80 text-sm rounded hover:bg-[#000000]/40 border border-[#f9b72d]/10">
                      Topics
                    </button>
                    <button className="px-3 py-1 bg-[#f9b72d]/20 text-[#f9b72d] text-sm rounded border border-[#f9b72d]/30">
                      Hashtags
                    </button>
                    <button className="px-3 py-1 bg-[#000000]/30 text-[#cccccc]/80 text-sm rounded hover:bg-[#000000]/40 border border-[#f9b72d]/10">
                      Users
                    </button>
                  </div>
                </div>
                
                {/* Placeholder for chart */}
                <div className="w-full h-80 bg-[#000000]/30 rounded-lg flex items-center justify-center border border-[#f9b72d]/5">
                  {isLoading ? (
                    <div className="animate-pulse w-full h-full bg-[#111111]"></div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <p className="text-[#cccccc]/60 mb-2">X.com Trends Analytics</p>
                      <p className="text-[#f9b72d] text-sm">Trending data from X.com API</p>
                    </div>
                  )}
                </div>
              </div>
            </MovingBorder>
            
            {/* Popular Categories */}
            <h2 className="text-xl font-bold text-[#ffffff] mb-4">Trend Categories</h2>
            <AuroraBackground 
              className="rounded-xl py-6 px-4 mb-8"
              position={{ x: 0, y: 0 }}
              primaryColor="#f9b72d"
              secondaryColor="#cccccc"
              size="40%"
            >
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {isLoading ? (
                    Array(3).fill(0).map((_, index) => (
                      <div key={index} className="bg-[#000000]/20 backdrop-blur-sm p-4 rounded-lg h-32 animate-pulse">
                        <div className="h-6 bg-[#333333] rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-[#333333] rounded w-2/3 mb-3"></div>
                        <div className="h-3 bg-[#333333] rounded w-full"></div>
                      </div>
                    ))
                  ) : (
                    categoriesData.map((category, index) => (
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
                    ))
                  )}
                </div>
              </div>
            </AuroraBackground>
          </GatedSection>
        </div>
      </div>
    </Layout>
  );
} 