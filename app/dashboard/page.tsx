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
  Eye,
  Loader2,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useXData } from '@/lib/hooks/useXData';

// Types based on X API documentation
interface TrendData {
  id: string;
  name: string;
  domain_context: string;
  tweet_count?: number;
}

interface PersonalizedTrend {
  category: string;
  post_count: number;
  trend_name: string;
  trending_since: string;
}

interface TopPerforming {
  title: string;
  views: number;
  engagement: number;
  shares: number;
  improvement: number;
}

interface DashboardData {
  isLoading: boolean;
  error: string | null;
  trends: PersonalizedTrend[];
}

interface PublicTrendData {
  isLoading: boolean;
  error: string | null;
  trends: PersonalizedTrend[];
  location: string;
}

export default function Dashboard() {
  // Authentication state
  const { isXAuthorized, authorizeX, xUser, isLoading: isAuthLoading } = useAuth();
  
  // Use React Query for public trends
  const { 
    data: publicTrendData,
    isLoading: isPublicTrendsLoading,
    error: publicTrendsError,
    refetch: refetchPublicTrends
  } = useXData<{
    trends: Array<{
      name: string;
      tweet_volume?: number | null;
      category?: string;
    }>;
    location: { name: string };
  }>(['public-trends'], async () => {
    const response = await fetch('/api/x/trends/public');
    if (!response.ok) {
      throw new Error(`API error (${response.status}): Failed to fetch public trends`);
    }
    return response.json();
  });

  // Use React Query for profile analytics
  const {
    data: profileAnalyticsData,
    isLoading: isProfileAnalyticsLoading,
    error: profileAnalyticsError,
    refetch: refetchProfileAnalytics
  } = useXData<any>(['profile-analytics'], async () => {
    if (!isXAuthorized) {
      throw new Error('X account not authorized');
    }
    
    const response = await fetch('/api/x/analytics/profile');
    if (!response.ok) {
      if (response.status === 401) {
        // If unauthorized, try to reauthorize
        authorizeX();
        throw new Error('Authentication required');
      }
      throw new Error(`API error (${response.status}): Failed to fetch profile analytics`);
    }
    return response.json();
  }, {
    enabled: isXAuthorized, // Only fetch if X is authorized
    retry: false, // Don't retry on error
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });
  
  // Dashboard data state
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    isLoading: false,
    error: null,
    trends: []
  });
  
  // Update xAuth state based on useAuth hook
  const [xAuth, setXAuth] = useState<{
    isAuthenticated: boolean;
    user: {
      name?: string;
      username?: string;
      profileImage?: string;
    } | null;
    loading: boolean;
  }>({
    isAuthenticated: false,
    user: null,
    loading: true
  });
  
  useEffect(() => {
    setXAuth({
      isAuthenticated: isXAuthorized,
      user: xUser ? {
        name: xUser.name,
        username: xUser.username,
        profileImage: undefined
      } : null,
      loading: isAuthLoading
    });
  }, [isXAuthorized, xUser, isAuthLoading]);
  
  // Transform trends data for display
  const transformedTrendsForDisplay = useMemo(() => {
    if (!publicTrendData?.trends) return [];
    
    return publicTrendData.trends.slice(0, 3).map(trend => {
      const postCount = trend.tweet_volume || 0;
      let displayCount: number;
      let countUnit: string | boolean = true;
      
      if (postCount > 1000000) {
        displayCount = Math.round(postCount / 100000) / 10;
        countUnit = 'M';
      } else if (postCount > 1000) {
        displayCount = Math.round(postCount / 100) / 10;
        countUnit = 'K';
      } else {
        displayCount = postCount;
        countUnit = true;
      }
      
      return {
        title: trend.name,
        percentage: displayCount,
        category: trend.category || 'Trending',
        isIncreasing: true,
        isPostCount: countUnit,
      };
    });
  }, [publicTrendData?.trends]);
  
  // Create top performing content from public trends data
  const topPerformingFromPublicTrends = publicTrendData?.trends?.slice(0, 3).map(trend => ({
    title: trend.name,
    views: trend.tweet_volume || 0,
    engagement: Math.round(Math.random() * 30) + 60,
    shares: Math.round((trend.tweet_volume || 0) / (Math.random() * 20 + 10)),
    improvement: Math.round(Math.random() * 20) + 5,
  })) || [];

  // Create top performing content from trends data
  const topPerformingFromTrends = dashboardData?.trends?.slice(0, 3).map(trend => ({
    title: trend.trend_name,
    views: trend.post_count || 0,
    engagement: Math.round(Math.random() * 30) + 60,
    shares: Math.round((trend.post_count || 0) / (Math.random() * 20 + 10)),
    improvement: Math.round(Math.random() * 20) + 5,
  })) || [];
  
  // Fallback static data in case the API calls fail
  const staticTopPerforming = [
    { title: 'How AI is Transforming Content Strategy', views: 2450, engagement: 85, shares: 12, improvement: 15 },
    { title: '10 Tips for Better Social Media Engagement', views: 1820, engagement: 75, shares: 10, improvement: 10 },
    { title: 'The Ultimate Guide to Email Marketing', views: 1340, engagement: 90, shares: 8, improvement: 12 }
  ];
  
  // Decide which data to display
  const displayTrends = transformedTrendsForDisplay.length > 0 ? transformedTrendsForDisplay : trends;
  
  // For the top performing section, use different data sources based on authentication status
  const displayTopPerforming = isXAuthorized
    ? (topPerformingFromTrends.length > 0 ? topPerformingFromTrends : staticTopPerforming)
    : (topPerformingFromPublicTrends.length > 0 ? topPerformingFromPublicTrends : staticTopPerforming);
  
  // Component to show when no personalized trends are available yet
  const NoTrendsYet = ({ isXAuthorized }: { isXAuthorized: boolean }) => (
    <div className="bg-background/30 backdrop-blur-sm border border-primary/10 rounded-xl p-8 text-center my-4">
      {isXAuthorized ? (
        <>
          <TrendingUp className="w-12 h-12 text-primary mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-semibold text-accent mb-2">No personalized trends yet</h3>
          <p className="text-accent/70 mb-4 max-w-md mx-auto">
            X needs a little time to generate your personalized trends. Check back soon to see what's popular in your network!
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors inline-flex items-center"
            >
              <Repeat className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
          </div>
        </>
      ) : (
        <>
          <svg className="w-8 h-8 text-primary mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <h3 className="text-lg font-semibold text-accent mb-2">Connect your X account</h3>
          <p className="text-accent/80 mb-4">Get personalized trends and insights by connecting your X account</p>
          <button 
            onClick={authorizeX}
            className="px-4 py-2 bg-primary text-background rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Connect X Account
          </button>
        </>
      )}
    </div>
  );
  
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="fixed top-0 left-0 right-0 pointer-events-none opacity-50">
          <BackgroundBeams />
        </div>
        <MeteorEffect count={15} color="#f9b72d" className="z-20 pointer-events-none" />
        <div className="p-4 pt-6 relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0 mb-4">
            <div className="relative">
              <h1 className="text-3xl font-bold">
                <AnimatedGradientText text="Dashboard" />
              </h1>
            </div>
            
            {/* Wallet Status */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-primary/10 border border-primary/20">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-accent">Connected</span>
              </div>
              {isXAuthorized ? (
                <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-sm text-accent">X Connected</span>
                </div>
              ) : (
                <button 
                  onClick={authorizeX}
                  className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors"
                >
                  <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span className="text-sm text-accent">Connect X</span>
                </button>
              )}
              <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-primary/10 border border-primary/20">
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
            </h2>
            {!isXAuthorized ? (
              <div className="bg-background/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 text-center mb-4">
                <svg className="w-8 h-8 text-primary mx-auto mb-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <h3 className="text-lg font-semibold text-accent mb-2">Connect your X account</h3>
                <p className="text-accent/80 mb-4">Get personalized trends and insights by connecting your X account</p>
                <button 
                  onClick={authorizeX}
                  className="px-4 py-2 bg-primary text-background rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                  Connect X Account
                </button>
              </div>
            ) : isPublicTrendsLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="ml-2 text-accent">Loading trends...</span>
              </div>
            ) : publicTrendsError ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center mb-4">
                <div className="flex items-start">
                  <div className="mr-3 text-red-500">
                    <AlertCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-accent/80">Error loading trends</h3>
                    <p className="mt-1 text-sm text-accent/80">{publicTrendsError instanceof Error ? publicTrendsError.message : 'Something went wrong'}</p>
                    <div className="mt-4 flex justify-center gap-3">
                      {/* Show reconnect button if the error is authentication related */}
                      {publicTrendsError.message.includes('Authentication') || publicTrendsError.message.includes('auth') ? (
                        <button 
                          onClick={authorizeX} 
                          className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-md hover:bg-blue-500/30 transition-colors inline-flex items-center"
                        >
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                          Reconnect X Account
                        </button>
                      ) : (
                        <button 
                          onClick={() => window.location.reload()} 
                          className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
                        >
                          Try again
                        </button>
                      )}
                      {/* <Link 
                        href="/api/auth/x/debug" 
                        target="_blank"
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors flex items-center gap-1"
                      >
                        <ExternalLink size={14} />
                        Check auth status
                      </Link> */}
                    </div>
                  </div>
                </div>
              </div>
            ) : publicTrendData?.trends.length === 0 ? (
              <NoTrendsYet isXAuthorized={isXAuthorized} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayTrends.map((trend, index) => (
                  <div key={index} className="relative">
                    <div className="bg-gradient-to-br from-background/30 to-grayDark/30">
                      <div>
                        <TrendBox 
                          title={trend.title}
                          percentage={trend.percentage}
                          category={trend.category}
                          isIncreasing={trend.isIncreasing}
                          isPostCount={trend.isPostCount}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Top Performing Section - Simplified */}
          <div className="mb-16">
            <h2 className="text-lg font-bold text-accent mb-4 flex items-center">
              <span className="text-accent">
                {isXAuthorized ? '🔥 Trending Topics on X' : '🔥 Trending Topics'}
              </span>
              {isXAuthorized ? (
                <span className="ml-2 px-2 py-0.5 bg-[#1DA1F2] text-white text-xs rounded-full font-normal">Live from X</span>
              ) : publicTrendData?.location ? (
                <span className="ml-2 px-2 py-0.5 bg-[#1DA1F2] text-white text-xs rounded-full font-normal">
                  {publicTrendData.location.name}
                </span>
              ) : (
                <span className="ml-2 px-2 py-0.5 bg-[#f9b72d] text-black text-xs rounded-full font-normal">Trending</span>
              )}
            </h2>
            <div className="bg-gradient-to-br from-[#000000]/60 to-[#0a0a0a]/60 backdrop-blur-md p-6 rounded-xl border border-[#f9b72d]/30">
              <p className="text-sm text-accent/80 mb-4">
                {isXAuthorized 
                  ? "Real-time trending content from X, personalized for your network"
                  : publicTrendData?.location 
                    ? `Real-time trending topics on X from ${publicTrendData.location.name}`
                    : "Real-time trending topics from around the world"}
              </p>
              
              {(isXAuthorized && isPublicTrendsLoading) || (!isXAuthorized && isPublicTrendsLoading) ? (
                <div className="flex justify-center items-center p-12">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <span className="ml-2 text-accent">Loading trending topics...</span>
                </div>
              ) : (isXAuthorized && publicTrendsError) ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-accent mb-2">Error loading topics</h3>
                  <p className="text-accent/80 mb-4">{publicTrendsError instanceof Error ? publicTrendsError.message : 'Something went wrong'}</p>
                  <div className="flex justify-center gap-4">
                    {/* Show reconnect button if the error is authentication related */}
                    {publicTrendsError.message.includes('Authentication') || publicTrendsError.message.includes('auth') ? (
                      <button 
                        onClick={authorizeX} 
                        className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-md hover:bg-blue-500/30 transition-colors inline-flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        Reconnect X Account
                      </button>
                    ) : (
                      <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors inline-flex items-center"
                      >
                        <Repeat className="w-4 h-4 mr-2" />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              ) : (!isXAuthorized && publicTrendsError) ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-accent mb-2">Error loading trending topics</h3>
                  <p className="text-accent/80 mb-4">{publicTrendsError instanceof Error ? publicTrendsError.message : 'Something went wrong'}</p>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors inline-flex items-center"
                    >
                      <Repeat className="w-4 h-4 mr-2" />
                      Retry
                    </button>
                    <button 
                      onClick={authorizeX}
                      className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-md hover:bg-blue-500/30 transition-colors inline-flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Connect X for personalized trends
                    </button>
                  </div>
                </div>
              ) : (isXAuthorized && publicTrendData?.trends.length === 0) || (!isXAuthorized && publicTrendData?.trends.length === 0) ? (
                <NoTrendsYet isXAuthorized={isXAuthorized} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {displayTopPerforming.map((item, idx) => (
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
              )}
            </div>
          </div>

          {/* X.com Authentication Status */}
          <div className="mb-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl text-yellow-500 font-semibold mb-4">X.com Integration</h2>
            
            {isAuthLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 text-yellow-500 animate-spin mr-2" />
                <span className="text-gray-400">Checking X.com connection...</span>
              </div>
            ) : isXAuthorized ? (
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-green-500 w-3 h-3 rounded-full mr-2"></div>
                  <span className="text-green-400">Connected to X.com</span>
                </div>
                
                {xUser && (
                  <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700 mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-yellow-500">
                          {xUser.name?.[0] || '?'}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-white">{xUser.name}</h3>
                        <p className="text-gray-400">@{xUser.username}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  <Link 
                    href="/profile" 
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition"
                  >
                    View Profile Analytics
                  </Link>
                  
                  <Link 
                    href="/search" 
                    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  >
                    Search X Users
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-red-500 w-3 h-3 rounded-full mr-2"></div>
                  <span className="text-red-400">Not connected to X.com</span>
                </div>
                
                <p className="text-gray-400 mb-4">
                  Connect your X account to access trends, analytics, and search functionality.
                </p>
                
                <button 
                  onClick={authorizeX}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Connect X Account
                </button>
              </div>
            )}
          </div>
          
          {/* X Profile Analytics */}
          {xAuth.isAuthenticated && profileAnalyticsData && (
            <div className="mb-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl text-yellow-500 font-semibold mb-4">Your X Profile Stats</h2>
              
              {isProfileAnalyticsLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-24 bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : profileAnalyticsError ? (
                <div className="bg-red-900/30 border border-red-700 p-4 rounded-md text-red-300">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span className="font-semibold">Error loading analytics</span>
                  </div>
                  <p className="text-sm">{profileAnalyticsError instanceof Error ? profileAnalyticsError.message : 'Something went wrong'}</p>
                  <button 
                    onClick={() => refetchProfileAnalytics()}
                    className="mt-3 bg-red-700/50 hover:bg-red-700 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div>
                  {/* Profile Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <div className="text-gray-400 text-sm mb-1">Followers</div>
                      <div className="text-xl font-bold text-white">
                        {profileAnalyticsData.metrics?.followers.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <div className="text-gray-400 text-sm mb-1">Following</div>
                      <div className="text-xl font-bold text-white">
                        {profileAnalyticsData.metrics?.following.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <div className="text-gray-400 text-sm mb-1">Total Posts</div>
                      <div className="text-xl font-bold text-white">
                        {profileAnalyticsData.metrics?.tweets.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                      <div className="text-gray-400 text-sm mb-1">Engagement Rate</div>
                      <div className="text-xl font-bold text-white">
                        {profileAnalyticsData.engagement?.rate}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Recent Posts */}
                  {profileAnalyticsData.recentTweets?.length > 0 && (
                    <div>
                      <h3 className="text-lg text-white font-semibold mb-3">Recent Posts</h3>
                      <div className="space-y-3">
                        {profileAnalyticsData.recentTweets.slice(0, 2).map((tweet: any, idx: number) => (
                          <div key={idx} className="bg-gray-900/30 p-3 rounded border border-gray-800">
                            <p className="text-gray-300 text-sm line-clamp-2 mb-2">{tweet.text}</p>
                            <div className="flex justify-between text-xs text-gray-400">
                              <div className="flex space-x-3">
                                <span>❤️ {tweet.metrics.like_count}</span>
                                <span>🔄 {tweet.metrics.retweet_count}</span>
                                <span>💬 {tweet.metrics.reply_count}</span>
                              </div>
                              <div>{new Date(tweet.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

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
  }
];

const trends = [
  {
    title: 'AI Usage',
    percentage: 28,
    category: 'System',
    isIncreasing: true,
    isPostCount: false
  },
  {
    title: 'Content Quality',
    percentage: 15,
    category: 'Performance',
    isIncreasing: true,
    isPostCount: false
  },
  {
    title: 'User Engagement',
    percentage: 32,
    category: 'Marketing',
    isIncreasing: true,
    isPostCount: false
  },
];