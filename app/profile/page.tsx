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
      postFrequency: Array<{
        hour: number;
        count: number;
      }>;
    };
  };
}

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/x/auth/check');
        const data = await res.json();
        setIsAuthenticated(data.isAuthenticated);
        
        if (data.isAuthenticated) {
          fetchProfileData();
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setError('Failed to check authentication status');
        setIsLoading(false);
      }
    }
    
    async function fetchProfileData() {
      try {
        const res = await fetch('/api/x/profile');
        
        if (!res.ok) {
          throw new Error('Failed to fetch profile data');
        }
        
        const data = await res.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, []);
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date);
  }
  
  return (
    <Layout>
      <div className="min-h-screen bg-[#000000] overflow-hidden">
        <div className="fixed top-0 left-0 right-0">
          <BackgroundBeams />
        </div>
        <div className="relative z-10 px-4 py-6">
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2">
              <AnimatedGradientText text="X.com Profile Analytics" />
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
          
          {/* Authentication Check */}
          {!isAuthenticated && !isLoading && (
            <div className="max-w-4xl mx-auto my-12 bg-[#000000]/30 border border-[#f9b72d]/20 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Connect Your X Account</h2>
              <p className="text-[#cccccc] mb-6">
                To view your X.com profile analytics, please connect your X account first.
              </p>
              <MovingBorder
                borderRadius="0.5rem"
                className="inline-block p-0.5 bg-gradient-to-br from-[#f9b72d] via-[#f9b72d]/50 to-transparent"
              >
                <a 
                  href="/api/x/auth" 
                  className="block px-6 py-3 bg-[#000000]/80 text-[#f9b72d] rounded-md hover:bg-[#000000]/60 transition-colors"
                >
                  Connect X Account
                </a>
              </MovingBorder>
            </div>
          )}
          
          {/* Loading State */}
          {isLoading && (
            <div className="max-w-4xl mx-auto my-12">
              <div className="flex flex-col space-y-4">
                <div className="h-32 bg-[#000000]/30 border border-[#f9b72d]/10 p-4 rounded-lg animate-pulse">
                  <div className="flex">
                    <div className="w-24 h-24 bg-[#333333] rounded-full mr-4"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-[#333333] rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-[#333333] rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-[#333333] rounded w-full"></div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-[#000000]/30 border border-[#f9b72d]/10 p-4 rounded-lg animate-pulse">
                      <div className="h-5 bg-[#333333] rounded w-1/2 mb-3"></div>
                      <div className="h-8 bg-[#333333] rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Error State */}
          {error && !isLoading && (
            <div className="max-w-4xl mx-auto my-12 bg-red-500/20 border border-red-500/30 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-red-200 mb-2">Error</h2>
              <p className="text-red-200">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-500/30 text-red-200 rounded-md hover:bg-red-500/40 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Profile Content */}
          {profileData && !isLoading && (
            <div className="max-w-5xl mx-auto">
              {/* Profile Header */}
              <HoverGlowEffect>
                <div className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 p-6 rounded-lg mb-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center">
                    {profileData.profile.profileImage ? (
                      <Image 
                        src={profileData.profile.profileImage} 
                        alt={profileData.profile.name}
                        width={96}
                        height={96}
                        className="rounded-full mb-4 md:mb-0 md:mr-6"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-[#222222] rounded-full flex items-center justify-center text-3xl text-[#f9b72d] mb-4 md:mb-0 md:mr-6">
                        {profileData.profile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <div>
                      <div className="flex items-center">
                        <h2 className="text-2xl font-bold text-[#ffffff]">{profileData.profile.name}</h2>
                        {profileData.profile.verified && (
                          <span className="ml-2 bg-[#f9b72d]/20 text-[#f9b72d] text-xs px-2 py-1 rounded">Verified</span>
                        )}
                      </div>
                      
                      <p className="text-[#cccccc] mb-2">@{profileData.profile.username}</p>
                      
                      <p className="text-[#ffffff]/80 mb-4 max-w-2xl">
                        {profileData.profile.description || "No description"}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-[#cccccc]">
                        {profileData.profile.location && (
                          <span>📍 {profileData.profile.location}</span>
                        )}
                        {profileData.profile.url && (
                          <a 
                            href={profileData.profile.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#f9b72d] hover:underline"
                          >
                            🔗 {profileData.profile.url.replace(/^https?:\/\/(www\.)?/, '')}
                          </a>
                        )}
                        {profileData.profile.createdAt && (
                          <span>🗓️ Joined {formatDate(profileData.profile.createdAt)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </HoverGlowEffect>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "Tweets", value: profileData.analytics.totalTweets.toLocaleString() },
                  { label: "Followers", value: profileData.analytics.totalFollowers.toLocaleString() },
                  { label: "Following", value: profileData.analytics.totalFollowing.toLocaleString() },
                  { 
                    label: "Engagement Rate", 
                    value: `${(profileData.analytics.engagement.engagementRate * 100).toFixed(1)}%` 
                  }
                ].map((metric, index) => (
                  <CardContainer key={index} className="w-full">
                    <CardBody className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 p-4 rounded-lg">
                      <h3 className="text-xs text-[#cccccc]/70 mb-1">{metric.label}</h3>
                      <p className="text-2xl font-bold text-[#ffffff]">{metric.value}</p>
                    </CardBody>
                  </CardContainer>
                ))}
              </div>
              
              {/* Engagement Metrics */}
              <h2 className="text-xl font-bold text-[#ffffff] mb-4">Engagement Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { 
                    label: "Average Likes", 
                    value: Math.round(profileData.analytics.engagement.averageLikes).toLocaleString(),
                    total: profileData.analytics.engagement.totalLikes.toLocaleString()
                  },
                  { 
                    label: "Average Retweets", 
                    value: Math.round(profileData.analytics.engagement.averageRetweets).toLocaleString(),
                    total: profileData.analytics.engagement.totalRetweets.toLocaleString()
                  },
                  { 
                    label: "Average Replies", 
                    value: Math.round(profileData.analytics.engagement.averageReplies).toLocaleString(),
                    total: profileData.analytics.engagement.totalReplies.toLocaleString()
                  },
                ].map((metric, index) => (
                  <HoverGlowEffect key={index}>
                    <div className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 p-4 rounded-lg">
                      <h3 className="text-sm text-[#cccccc]/70 mb-1">{metric.label}</h3>
                      <p className="text-2xl font-bold text-[#ffffff] mb-1">{metric.value}</p>
                      <p className="text-xs text-[#cccccc]">Total: {metric.total}</p>
                    </div>
                  </HoverGlowEffect>
                ))}
              </div>
              
              {/* Posting Patterns */}
              <h2 className="text-xl font-bold text-[#ffffff] mb-4">Posting Patterns</h2>
              <MovingBorder
                borderRadius="0.5rem"
                className="w-full p-1 bg-gradient-to-br from-[#f9b72d] via-[#f9b72d]/50 to-transparent mb-8"
              >
                <div className="bg-[#000000]/80 backdrop-blur-sm p-6 rounded-[0.4rem]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-sm text-[#cccccc]/70 mb-2">Most Active Day</h3>
                      <p className="text-2xl font-bold text-[#ffffff]">{profileData.analytics.patterns.mostActiveDay}</p>
                    </div>
                    <div>
                      <h3 className="text-sm text-[#cccccc]/70 mb-2">Most Active Time</h3>
                      <p className="text-2xl font-bold text-[#ffffff]">{profileData.analytics.patterns.mostActiveTime}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-[#cccccc]/70 mb-2">Average Posts Per Day</h3>
                    <p className="text-2xl font-bold text-[#ffffff] mb-8">{profileData.analytics.patterns.averagePostsPerDay.toFixed(1)}</p>
                  </div>
                  
                  {/* Post Frequency by Hour Visualization */}
                  <h3 className="text-sm text-[#cccccc]/70 mb-4">Post Frequency by Hour</h3>
                  <div className="h-40 flex items-end">
                    {profileData.analytics.patterns.postFrequency.map((hour, index) => (
                      <div 
                        key={index} 
                        className="flex-1 h-full flex flex-col justify-end items-center"
                      >
                        <div 
                          className="w-full bg-[#f9b72d]/70 hover:bg-[#f9b72d] transition-colors rounded-t"
                          style={{ 
                            height: `${Math.max(5, (hour.count / Math.max(...profileData.analytics.patterns.postFrequency.map(h => h.count))) * 100)}%` 
                          }}
                          title={`${hour.hour}:00 - ${hour.count} posts`}
                        />
                        {index % 6 === 0 && (
                          <span className="text-[10px] text-[#cccccc]/70 mt-1">
                            {hour.hour % 12 || 12}{hour.hour < 12 ? 'am' : 'pm'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </MovingBorder>
              
              {/* External Link */}
              <div className="text-center mb-8">
                <a 
                  href={`https://x.com/${profileData.profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#000000]/30 border border-[#f9b72d]/30 text-[#f9b72d] px-6 py-3 rounded-lg hover:bg-[#000000]/50 transition-colors"
                >
                  View Profile on X.com →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 