'use client';

import ContentCard from "@/components/ContentCard";
import GatedSection from "@/components/GatedSection";
import Layout from "@/components/Layout";
import TrendBox from "@/components/TrendBox";
import { MeteorEffect } from "@/components/aceternity/meteor-effect";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { MovingBorder } from "@/components/aceternity/moving-border";
import { CardContainer, CardBody, CardItem } from "@/components/aceternity/3d-card";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { SparklesCore } from "@/components/aceternity/sparkles";
import { WavyBackground } from "@/components/aceternity/wavy-background";
import { TracingBeam } from "@/components/aceternity/tracing-beam";
import Link from "next/link";
import { 
  PenTool, 
  BarChart3, 
  Users, 
  Repeat, 
  Share, 
  Cable, 
  AlertTriangle, 
  FileEdit, 
  Calendar, 
  Bell, 
  TrendingUp, 
  Clock,
  Sparkles,
  Bot,
  Zap,
  Star,
  Timer,
  Eye
} from "lucide-react";

export default function Dashboard() {
  // Simulate wallet connection and token presence
  const hasToken = true; // Set to false to simulate restriction
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="fixed top-0 left-0 right-0 pointer-events-none opacity-50">
          <BackgroundBeams />
        </div>
        <MeteorEffect count={15} color="#f9b72d" className="z-20 pointer-events-none" />
        <div className="p-4 pt-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="relative">
              <h1 className="text-3xl font-bold">
                <AnimatedGradientText text="Dashboard" />
              </h1>
            </div>
            
            {/* Wallet Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-accent">Connected</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-accent">Pro Active</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="w-full">
              <div className="bg-gradient-to-br from-grayDark/30 via-background/30 to-background/40 backdrop-blur-sm rounded-xl border border-primary/10 p-4">
                <h2 className="text-lg font-bold text-accent mb-3 flex justify-between items-center">
                  <span className="text-accent">Recent Content</span>
                  <Link href="/content-creation" className="text-xs px-3 py-1 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-md hover:from-primary/30 hover:to-primary/20 transition-all font-normal">
                    View All Content
                  </Link>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {recentContent.slice(0, 4).map((content, index) => (
                    <div key={index} className="group">
                      <div className="relative">
                        <div className="bg-gradient-to-br from-background/30 to-grayDark/30 border border-primary/10 rounded-xl overflow-hidden p-0 transition-transform duration-200 group-hover:scale-[1.02]">
                          <div className="w-full">
                            <ContentCard 
                              title={content.title}
                              content={content.content}
                              image={content.image}
                              date={content.date}
                              category={content.category}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        
          {/* Trends - Simplified version */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-accent flex justify-between items-center mb-4">
              <span className="text-accent">Content Trends</span>
              <Link href="/analytics" className="text-xs px-3 py-1 bg-gradient-to-r from-primary/20 to-primary/10 text-primary rounded-md hover:from-primary/30 hover:to-primary/20 transition-all font-normal">
                Full Analytics
              </Link>
            </h2>
            <GatedSection hasAccess={hasToken}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trends.map((trend, index) => (
                  <div key={index} className="relative">
                    <div className="bg-gradient-to-br from-background/30 to-grayDark/30">
                      <div>
                        <TrendBox 
                          title={trend.title}
                          percentage={trend.percentage}
                          category={trend.category}
                          isIncreasing={trend.isIncreasing}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GatedSection>
          </div>
          
          {/* Top Performing Section - Simplified */}
          <div className="mb-16">
            <h2 className="text-lg font-bold text-accent mb-4 flex items-center">
              <span className="text-accent">🔥 Top Performing Content</span>
              <span className="ml-2 px-2 py-0.5 bg-[#f9b72d] text-black text-xs rounded-full font-normal">Outperforming competitors</span>
            </h2>
            <div className="bg-gradient-to-br from-[#000000]/60 to-[#0a0a0a]/60 backdrop-blur-md p-6 rounded-xl border border-[#f9b72d]/30">
              <p className="text-sm text-accent/80 mb-4">Posts created with AutonoBee consistently outperform industry averages</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topPerforming.map((item, idx) => (
                  <div key={idx} className="group relative">
                    <div className="bg-background/40 backdrop-blur-sm p-4 rounded-lg border border-primary/10">
                      <h3 className="font-semibold text-accent mb-2">{item.title}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-accent/60">Views</div>
                          <div className="text-lg font-semibold text-primary">{item.views.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-sm text-accent/60">Engagement</div>
                          <div className="text-lg font-semibold text-primary">{item.engagement}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-accent/60">Shares</div>
                          <div className="text-lg font-semibold text-primary">{item.shares}</div>
                        </div>
                        <div>
                          <div className="text-sm text-accent/60">Improvement</div>
                          <div className="text-lg font-semibold text-green-500">+{item.improvement}%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Helper function to get icon based on stat title
function getStatIcon(title: string) {
  switch (title) {
    case 'Total AI Generations':
      return <Bot className="w-4 h-4 text-primary" />;
    case 'Active Bots':
      return <Zap className="w-4 h-4 text-primary" />;
    case 'Tokens Used':
      return <Sparkles className="w-4 h-4 text-primary" />;
    case 'Content Score':
      return <Star className="w-4 h-4 text-primary" />;
    case 'Days Active':
      return <Timer className="w-4 h-4 text-primary" />;
    default:
      return null;
  }
}

const stats = [
  { title: 'Total AI Generations', value: '1,240', changePercent: 12, isIncreasing: true },
  { title: 'Active Bots', value: '7', changePercent: 5, isIncreasing: true },
  { title: 'Tokens Used', value: '34.5K', changePercent: 3, isIncreasing: false },
  { title: 'Content Score', value: '92', changePercent: 8, isIncreasing: true },
  { title: 'Days Active', value: '18', changePercent: 100, isIncreasing: true },
];

const recentContent = [
  {
    title: 'Weekly Performance Analysis',
    content: 'An analysis of the past week\'s performance metrics across all marketing channels.',
    image: '/images/ai-dashboard.jpg',
    date: 'Yesterday, 2:15 PM',
    category: 'Analytics'
  },
  {
    title: 'Product Launch Email Sequence',
    content: 'A 5-part email sequence for the upcoming product launch, targeting existing customers.',
    image: '/images/ai-writing.jpg',
    date: 'Mar 22, 2024',
    category: 'Email'
  },
  {
    title: 'Landing Page Copy Draft',
    content: 'Draft copy for the new product landing page, including headlines, features and benefits.',
    image: '/images/ai-content.jpg',
    date: 'Mar 20, 2024',
    category: 'Website'
  },
  {
    title: 'X Platform Tweet Strategy',
    content: 'Engagement-focused X platform content strategy with AI-generated tweet templates and hashtag recommendations.',
    image: '/images/ai-dashboard.jpg',
    date: 'Mar 19, 2024',
    category: 'Social Media'
  },
  {
    title: 'Quarterly Content Calendar',
    content: 'Three-month content planning calendar with themes, topics, and publishing schedule for all channels.',
    image: '/images/ai-writing.jpg',
    date: 'Mar 18, 2024',
    category: 'Planning'
  }
];

const upcomingSchedule = [
  {
    time: '11:00 AM',
    duration: '30 min',
    title: 'Weekly Team Meeting',
    description: 'Content strategy discussion with marketing team',
    status: 'Starting soon',
    statusColor: 'bg-yellow-500'
  },
  {
    time: '1:30 PM',
    duration: '45 min',
    title: 'Content Review',
    description: 'Review social media posts for approval',
    status: 'Scheduled',
    statusColor: 'bg-primary'
  },
  {
    time: '3:00 PM',
    duration: '60 min',
    title: 'Analytics Report',
    description: 'Prepare monthly performance report',
    status: 'Scheduled',
    statusColor: 'bg-accent/70'
  }
];

const trends = [
  {
    title: 'AI Usage',
    percentage: 28,
    category: 'System',
    isIncreasing: true
  },
  {
    title: 'Content Quality',
    percentage: 15,
    category: 'Performance',
    isIncreasing: true
  },
  {
    title: 'User Engagement',
    percentage: 32,
    category: 'Marketing',
    isIncreasing: true
  },
];

const topPerforming = [
  { title: 'How AI is Transforming Content Strategy', views: 2450, engagement: 85, shares: 12, improvement: 15 },
  { title: '10 Tips for Better Social Media Engagement', views: 1820, engagement: 75, shares: 10, improvement: 10 },
  { title: 'The Ultimate Guide to Email Marketing', views: 1340, engagement: 90, shares: 8, improvement: 12 }
];

const activities = [
  {
    icon: FileEdit,
    title: 'New Content Created',
    description: 'You created "Q2 Marketing Strategy" using AI Assistant',
    time: '2 hours ago'
  },
  {
    icon: Repeat,
    title: 'Content Repurposed',
    description: 'Blog post converted to 5 social media posts',
    time: 'Yesterday'
  },
  {
    icon: BarChart3,
    title: 'Report Generated',
    description: 'Monthly performance analytics report was generated',
    time: '2 days ago'
  }
];

const notifications = [
  {
    icon: Bell,
    title: 'New Comment',
    description: 'Sarah commented on your latest post',
    time: '30 minutes ago',
    unread: true,
    gradientBg: 'bg-gradient-to-br from-primary/30 to-primary/10'
  },
  {
    icon: TrendingUp,
    title: 'Performance Alert',
    description: 'Your post is performing 25% better than average',
    time: '2 hours ago',
    unread: true,
    gradientBg: 'bg-gradient-to-br from-green-500/30 to-green-500/10'
  },
  {
    icon: AlertTriangle,
    title: 'Content Due',
    description: 'Weekly newsletter content is due today',
    time: '5 hours ago',
    unread: false,
    gradientBg: 'bg-gradient-to-br from-accent/30 to-accent/10'
  }
]; 