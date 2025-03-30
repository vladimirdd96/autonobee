"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { SparklesCore } from "@/components/aceternity/sparkles";
import { MovingBorder } from "@/components/aceternity/moving-border";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, RefreshCw, MessageCircle, Share, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useXData } from "@/lib/hooks/useXData";

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author: {
    id: string;
    name: string;
    username: string;
    profile_image_url?: string;
  };
  metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
  entities?: {
    mentions?: Array<{ username: string }>;
    hashtags?: Array<{ tag: string }>;
    urls?: Array<{ expanded_url: string; display_url: string }>;
  };
  referenced_tweets?: Array<{
    type: "replied_to" | "retweeted" | "quoted";
    id: string;
  }>;
}

export default function Timeline() {
  const { isXAuthorized, authorizeX } = useAuth();

  const {
    data: timelineData,
    isLoading,
    error,
    refetch: refetchTimeline,
  } = useXData<{ tweets: Tweet[] }>(
    ['timeline'],
    async () => {
      const response = await fetch('/api/x/timeline');
      if (!response.ok) {
        throw new Error(`API error (${response.status}): Failed to fetch timeline`);
      }
      return response.json();
    },
    {
      enabled: isXAuthorized,
    }
  );

  // Format tweet text with hashtags, mentions, and links
  function formatTweetText(tweet: Tweet) {
    let text = tweet.text;
    
    // Replace URLs with clickable links
    if (tweet.entities?.urls) {
      tweet.entities.urls.forEach(url => {
        text = text.replace(
          url.expanded_url,
          `<a href="${url.expanded_url}" target="_blank" rel="noopener noreferrer" class="text-[#1DA1F2] hover:underline">${url.display_url}</a>`
        );
      });
    }
    
    // Replace mentions with links
    if (tweet.entities?.mentions) {
      tweet.entities.mentions.forEach(mention => {
        text = text.replace(
          `@${mention.username}`,
          `<a href="https://x.com/${mention.username}" target="_blank" rel="noopener noreferrer" class="text-[#1DA1F2] hover:underline">@${mention.username}</a>`
        );
      });
    }
    
    // Replace hashtags with links
    if (tweet.entities?.hashtags) {
      tweet.entities.hashtags.forEach(hashtag => {
        text = text.replace(
          `#${hashtag.tag}`,
          `<a href="https://x.com/hashtag/${hashtag.tag}" target="_blank" rel="noopener noreferrer" class="text-[#1DA1F2] hover:underline">#${hashtag.tag}</a>`
        );
      });
    }
    
    return text;
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h`;
    } else {
      return date.toLocaleDateString();
    }
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
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2">
              <AnimatedGradientText text="Your X Timeline" />
            </h1>
          </div>
          
          {/* Authentication Check */}
          {!isXAuthorized && !isLoading && (
            <div className="max-w-4xl mx-auto my-12 bg-[#000000]/30 border border-[#f9b72d]/20 p-8 rounded-lg text-center">
              <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Connect Your X Account</h2>
              <p className="text-[#cccccc] mb-6">
                To view your X.com timeline, please connect your X account first.
              </p>
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
          )}
          
          {/* Loading State */}
          {isLoading && (
            <div className="max-w-2xl mx-auto my-12 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-[#f9b72d] animate-spin mb-4" />
              <p className="text-[#cccccc]">Loading your timeline...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && !isLoading && (
            <div className="max-w-2xl mx-auto my-8 bg-red-500/20 border border-red-500/50 p-6 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Error Loading Timeline</h3>
                  <p className="text-white/80 mb-4">{error instanceof Error ? error.message : 'Failed to load your timeline'}</p>
                  <button
                    onClick={() => refetchTimeline()}
                    className="px-4 py-2 bg-red-500/30 text-white rounded-md hover:bg-red-500/50 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Timeline Display */}
          {isXAuthorized && !isLoading && !error && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#ffffff]">Recent Tweets</h2>
                <button
                  onClick={() => refetchTimeline()}
                  className="flex items-center gap-2 px-3 py-1 bg-[#f9b72d]/10 text-[#f9b72d] rounded-md hover:bg-[#f9b72d]/20 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
              
              {timelineData?.tweets.length === 0 ? (
                <div className="bg-[#000000]/30 border border-[#f9b72d]/10 p-8 rounded-lg text-center">
                  <p className="text-[#cccccc]">No tweets found in your timeline.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {timelineData?.tweets.map(tweet => (
                    <HoverGlowEffect key={tweet.id}>
                      <div className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 p-5 rounded-lg">
                        {/* Tweet header - user info */}
                        <div className="flex items-center mb-3">
                          {tweet.author.profile_image_url ? (
                            <Image
                              src={tweet.author.profile_image_url}
                              alt={tweet.author.name}
                              width={48}
                              height={48}
                              className="rounded-full mr-3"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-[#333333] rounded-full mr-3 flex items-center justify-center text-[#cccccc]">
                              {tweet.author.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center">
                              <span className="font-bold text-[#ffffff] mr-2">{tweet.author.name}</span>
                              <span className="text-[#cccccc] text-sm">@{tweet.author.username}</span>
                            </div>
                            <span className="text-[#cccccc] text-xs">{formatDate(tweet.created_at)}</span>
                          </div>
                        </div>
                        
                        {/* Retweet indicator */}
                        {tweet.referenced_tweets?.some(rt => rt.type === "retweeted") && (
                          <div className="flex items-center text-[#cccccc] text-xs mb-2">
                            <RefreshCw className="w-3 h-3 mr-1" />
                            <span>Retweeted</span>
                          </div>
                        )}
                        
                        {/* Tweet body */}
                        <div 
                          className="text-[#ffffff] mb-4"
                          dangerouslySetInnerHTML={{ __html: formatTweetText(tweet) }}
                        />
                        
                        {/* Tweet actions */}
                        <div className="flex justify-between text-[#cccccc] pt-3 border-t border-[#f9b72d]/10">
                          <button className="flex items-center gap-1 text-xs hover:text-[#1DA1F2]">
                            <MessageCircle className="w-4 h-4" />
                            {tweet.metrics.reply_count > 0 && <span>{tweet.metrics.reply_count}</span>}
                          </button>
                          <button className="flex items-center gap-1 text-xs hover:text-green-400">
                            <RefreshCw className="w-4 h-4" />
                            {tweet.metrics.retweet_count > 0 && <span>{tweet.metrics.retweet_count}</span>}
                          </button>
                          <button className="flex items-center gap-1 text-xs hover:text-red-400">
                            <Heart className="w-4 h-4" />
                            {tweet.metrics.like_count > 0 && <span>{tweet.metrics.like_count}</span>}
                          </button>
                          <button className="flex items-center gap-1 text-xs hover:text-[#1DA1F2]">
                            <Share className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </HoverGlowEffect>
                  ))}
                </div>
              )}
              
              <div className="mt-6 text-center">
                <a 
                  href="https://x.com/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#000000]/30 border border-[#f9b72d]/30 text-[#f9b72d] px-6 py-3 rounded-lg hover:bg-[#000000]/50 transition-colors"
                >
                  View Full Timeline on X.com →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 