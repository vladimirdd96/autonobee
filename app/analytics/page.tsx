"use client";

import React from "react";
import Layout from "@/components/Layout";
import GatedSection from "@/components/GatedSection";
import { useWallet } from '@/contexts/WalletContext';
import { MeteorEffect } from "@/components/aceternity/meteor-effect";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { Sparkles } from "@/components/aceternity/sparkles";

// Card components
const CardContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className}>{children}</div>
);

const CardItem = ({ 
  children, 
  className, 
  translateZ = 0,
  as: Component = "div"
}: { 
  children: React.ReactNode; 
  className?: string;
  translateZ?: number;
  as?: keyof JSX.IntrinsicElements;
}) => (
  <Component className={className} style={{ transform: `translateZ(${translateZ}px)` }}>
    {children}
  </Component>
);

interface PerformanceMetric {
  label: string;
  value: string;
  percentage: number;
}

interface TopPost {
  content: string;
  date: string;
  engagement: string;
  reach: string;
}

// Mock data for charts and analytics
const performanceMetrics: PerformanceMetric[] = [
  { label: "Total Views", value: "12,450", percentage: 75 },
  { label: "Engagement Rate", value: "24.8%", percentage: 65 },
  { label: "Conversion Rate", value: "8.3%", percentage: 45 },
  { label: "Reach", value: "45.2K", percentage: 85 }
];

const topPosts: TopPost[] = [
  {
    content: "Exciting new features coming soon! 🚀",
    date: "2024-03-15",
    engagement: "2.4K",
    reach: "12.5K"
  },
  {
    content: "Join us for our next webinar on AI trends",
    date: "2024-03-14",
    engagement: "1.8K",
    reach: "9.2K"
  },
  {
    content: "Customer success story: How Company X improved their ROI",
    date: "2024-03-13",
    engagement: "1.2K",
    reach: "7.5K"
  }
];

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
    <Layout>
      <div className="min-h-screen bg-background overflow-hidden">
        <MeteorEffect count={5} color="#f9b72d" className="z-0" />
        <div className="pt-8 relative z-10">
          <h1 className="text-3xl font-bold mb-6">
            <Sparkles color="#f9b72d" count={4}>
              <AnimatedGradientText text="Analytics" />
            </Sparkles>
          </h1>

          {/* Performance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {performanceMetrics.map((metric, index) => (
              <CardContainer key={index} className="inter-var">
                <CardBody className="bg-background/20 backdrop-blur-sm border border-primary/10 relative group/card dark:hover:shadow-2xl dark:hover:shadow-primary/20/[0.2] dark:bg-black dark:border-white/[0.2] border-black/[0.2] w-full rounded-xl p-6">
                  <CardItem
                    translateZ={50}
                    className="text-xl font-bold text-accent"
                  >
                    {metric.label}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ={60}
                    className="text-accent/80 text-sm mt-2"
                  >
                    {metric.value}
                  </CardItem>
                  <CardItem
                    translateZ={40}
                    className="w-full mt-4"
                  >
                    <div className="h-2 bg-background/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${metric.percentage}%` }}
                      />
                    </div>
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>

          {/* Engagement Chart */}
          <div className="bg-background/20 backdrop-blur-sm border border-primary/10 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-accent mb-4">Engagement Over Time</h2>
            <div className="h-[400px]">
              {/* Chart component will go here */}
            </div>
          </div>

          {/* Top Posts */}
          <div className="bg-background/20 backdrop-blur-sm border border-primary/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-accent mb-4">Top Performing Posts</h2>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-accent/10"
                >
                  <div className="flex-1">
                    <p className="text-accent font-medium">{post.content}</p>
                    <p className="text-accent/60 text-sm mt-1">{post.date}</p>
                  </div>
                  <div className="flex space-x-6">
                    <div className="text-right">
                      <p className="text-accent/60 text-xs">Engagement</p>
                      <p className="text-accent font-medium">{post.engagement}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-accent/60 text-xs">Reach</p>
                      <p className="text-accent font-medium">{post.reach}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 