"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { MovingBorder } from "@/components/aceternity/moving-border";
import { SparklesCore } from "@/components/aceternity/sparkles";
import { CardContainer, CardBody } from "@/components/aceternity/3d-card";
import Image from "next/image";
import Link from "next/link";
import { useXData } from '@/lib/hooks/useXData';
import { useAuth } from "@/contexts/AuthContext";
import { RefreshCw } from "lucide-react";

interface ProfileData {
  profile: {
    id: string;
    username: string;
    name: string;
    description: string;
    profileImage: string | null;
    verified: boolean;
    metrics: {
      followers: number;
      following: number;
      tweets: number;
      likes: number;
    };
    location: string;
    url: string;
    createdAt: string;
  };
  analytics: {
    totalTweets: number;
    totalFollowers: number;
    totalFollowing: number;
    engagement: {
      averageLikes: number;
      averageRetweets: number;
      averageReplies: number;
      totalLikes: number;
      totalRetweets: number;
      totalReplies: number;
      engagementRate: number;
    };
    patterns: {
      mostActiveDay: string;
      mostActiveTime: string;
      averagePostsPerDay: number;
      postFrequency: Array<{ hour: number; count: number }>;
    };
  };
}

interface AnalyticsData {
  profile: {
    id: string;
    name: string;
    username: string;
  };
  metrics: {
    followers: number;
    following: number;
    tweets: number;
    listed: number;
  };
  engagement: {
    total: number;
    average: string;
    rate: string;
  };
  growth: {
    followers: number;
    engagement: number;
    views: number;
  };
  recentTweets: Array<{
    id: string;
    text: string;
    created_at: string;
    metrics: {
      retweet_count: number;
      reply_count: number;
      like_count: number;
      quote_count: number;
    };
  }>;
}

export default function Profile() {
  const { isXAuthorized, authorizeX } = useAuth();
  const [forceRefresh, setForceRefresh] = useState(false);

  // Use the new useXData hook for profile data
  const { 
    data: profileData, 
    isLoading: isProfileLoading, 
    error: profileError,
    refetch: refetchProfile 
  } = useXData<ProfileData>(
    ['profile'],
    async () => {
      const response = await fetch('/api/x/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }
      return response.json();
    },
    { 
      enabled: isXAuthorized,
      forceRefresh 
    }
  );

  // Use the new useXData hook for analytics data
  const { 
    data: analyticsData, 
    isLoading: isAnalyticsLoading, 
    error: analyticsError,
    refetch: refetchAnalytics 
  } = useXData<AnalyticsData>(
    ['analytics'],
    async () => {
      const response = await fetch('/api/x/analytics/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      return response.json();
    },
    { 
      enabled: isXAuthorized,
      forceRefresh 
    }
  );

  // Handle refresh button click
  const handleRefresh = () => {
    setForceRefresh(true);
    refetchProfile();
    refetchAnalytics();
    setTimeout(() => setForceRefresh(false), 1000);
  };

  const isLoading = isProfileLoading || isAnalyticsLoading;
  const error = profileError || analyticsError;

  if (!isXAuthorized) {
    return (
      <Layout>
        <div className="min-h-screen bg-black">
          <div className="fixed top-0 left-0 right-0 pointer-events-none">
            <BackgroundBeams />
          </div>
          <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
            <div className="flex flex-col items-center justify-center bg-background/30 backdrop-blur-sm border border-primary/10 p-8 rounded-xl text-center max-w-md">
              <h1 className="text-2xl font-bold text-accent mb-4">Connect Your X Account</h1>
              <p className="text-accent/80 mb-6">Connect your X account to view your profile analytics and insights.</p>
              <MovingBorder
                borderRadius="0.5rem"
                className="inline-block p-0.5 bg-gradient-to-br from-[#f9b72d] via-[#f9b72d]/50 to-transparent"
              >
                <button 
                  onClick={authorizeX}
                  className="block px-6 py-3 bg-[#000000]/80 text-[#f9b72d] rounded-md hover:bg-[#000000]/60 transition-colors"
                >
                  Connect X Account
                </button>
              </MovingBorder>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black">
          <div className="fixed top-0 left-0 right-0 pointer-events-none">
            <BackgroundBeams />
          </div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
              <p className="text-accent">Loading profile data...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-black">
          <div className="fixed top-0 left-0 right-0 pointer-events-none">
            <BackgroundBeams />
          </div>
          <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
            <div className="bg-red-500/20 border border-red-500/50 p-8 rounded-xl text-center max-w-md">
              <h1 className="text-2xl font-bold text-red-400 mb-4">Error Loading Profile</h1>
              <p className="text-accent/80 mb-6">{error instanceof Error ? error.message : 'Failed to load profile data'}</p>
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-red-500/30 text-white rounded-md hover:bg-red-500/50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!profileData?.profile || !analyticsData?.profile) {
    return (
      <Layout>
        <div className="min-h-screen bg-black">
          <div className="fixed top-0 left-0 right-0 pointer-events-none">
            <BackgroundBeams />
          </div>
          <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
            <div className="bg-background/30 backdrop-blur-sm border border-primary/10 p-8 rounded-xl text-center max-w-md">
              <h1 className="text-2xl font-bold text-accent mb-4">No Data Available</h1>
              <p className="text-accent/80 mb-6">Unable to load profile data. Please try again later.</p>
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] overflow-hidden">
        <div className="fixed top-0 left-0 right-0">
          <BackgroundBeams />
        </div>
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
        <div className="relative z-10 px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">
                <AnimatedGradientText text="Profile Analytics" />
              </h1>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
            </div>

            {/* Profile Section */}
            <HoverGlowEffect>
              <div className="bg-background/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 mb-8">
                <div className="flex items-center">
                  {profileData.profile.profileImage ? (
                    <Image
                      src={profileData.profile.profileImage}
                      alt={profileData.profile.name}
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-background/50 rounded-full flex items-center justify-center text-2xl text-accent">
                      {profileData.profile.name.charAt(0)}
                    </div>
                  )}
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-accent">{profileData.profile.name}</h2>
                    <p className="text-accent/60">@{profileData.profile.username}</p>
                    {profileData.profile.verified && (
                      <span className="text-primary text-sm">✓ Verified</span>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-accent/80">{profileData.profile.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="bg-background/20 p-4 rounded-lg">
                      <span className="text-accent/60">Followers</span>
                      <p className="text-xl font-bold text-accent">{profileData.profile.metrics.followers.toLocaleString()}</p>
                    </div>
                    <div className="bg-background/20 p-4 rounded-lg">
                      <span className="text-accent/60">Following</span>
                      <p className="text-xl font-bold text-accent">{profileData.profile.metrics.following.toLocaleString()}</p>
                    </div>
                    <div className="bg-background/20 p-4 rounded-lg">
                      <span className="text-accent/60">Tweets</span>
                      <p className="text-xl font-bold text-accent">{profileData.profile.metrics.tweets.toLocaleString()}</p>
                    </div>
                    <div className="bg-background/20 p-4 rounded-lg">
                      <span className="text-accent/60">Likes</span>
                      <p className="text-xl font-bold text-accent">{profileData.profile.metrics.likes.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </HoverGlowEffect>

            {/* Analytics Section */}
            <HoverGlowEffect>
              <div className="bg-background/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-accent mb-6">Analytics Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-background/20 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-accent/80 mb-2">Engagement Rate</h3>
                    <p className="text-2xl font-bold text-primary">{analyticsData.engagement.rate}%</p>
                  </div>
                  <div className="bg-background/20 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-accent/80 mb-2">Average Engagement</h3>
                    <p className="text-2xl font-bold text-primary">{analyticsData.engagement.average}</p>
                  </div>
                  <div className="bg-background/20 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-accent/80 mb-2">Total Engagement</h3>
                    <p className="text-2xl font-bold text-primary">{analyticsData.engagement.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Recent Tweets */}
                {analyticsData.recentTweets?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-accent mb-4">Recent Tweets</h3>
                    <div className="space-y-4">
                      {analyticsData.recentTweets.map((tweet) => (
                        <div key={tweet.id} className="bg-background/20 p-4 rounded-lg">
                          <p className="text-accent/80 mb-2">{tweet.text}</p>
                          <div className="flex gap-4 text-sm text-accent/60">
                            <span>🔄 {tweet.metrics.retweet_count}</span>
                            <span>💬 {tweet.metrics.reply_count}</span>
                            <span>❤️ {tweet.metrics.like_count}</span>
                            <span>🔖 {tweet.metrics.quote_count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </HoverGlowEffect>
          </div>
        </div>
      </div>
    </Layout>
  );
} 