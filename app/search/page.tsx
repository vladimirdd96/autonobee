"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { MovingBorder } from "@/components/aceternity/moving-border";
import { SparklesCore } from "@/components/aceternity/sparkles";
import Image from "next/image";
import Link from "next/link";

interface UserResult {
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
  };
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<UserResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/x/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to search users");
      }
      
      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
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
              <AnimatedGradientText text="X.com User Search" />
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
          
          {/* Search Form */}
          <div className="my-8 max-w-3xl mx-auto">
            <MovingBorder
              borderRadius="0.5rem"
              className="p-0.5 bg-gradient-to-br from-[#f9b72d] via-[#f9b72d]/50 to-transparent"
            >
              <form 
                onSubmit={handleSearch}
                className="w-full bg-[#000000]/80 backdrop-blur-sm p-4 rounded-[0.4rem] flex gap-2"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-[#000000]/50 border border-[#f9b72d]/30 text-[#ffffff] px-4 py-2 rounded-md focus:outline-none focus:border-[#f9b72d]/80"
                  placeholder="Search for X.com users..."
                />
                <button
                  type="submit"
                  className="bg-[#f9b72d] hover:bg-[#f9b72d]/80 text-[#000000] font-medium px-6 py-2 rounded-md transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? "Searching..." : "Search"}
                </button>
              </form>
            </MovingBorder>
            
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-md">
                {error}
              </div>
            )}
          </div>
          
          {/* Results */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-[#ffffff] mb-4">
              {results.length > 0 ? `Search Results (${results.length})` : "No results yet"}
            </h2>
            
            {isLoading ? (
              // Loading state
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-[#000000]/30 border border-[#f9b72d]/10 p-6 rounded-lg h-48 animate-pulse">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-[#333333] rounded-full mr-3"></div>
                      <div>
                        <div className="h-4 bg-[#333333] rounded w-24 mb-2"></div>
                        <div className="h-3 bg-[#333333] rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-[#333333] rounded w-full mb-3"></div>
                    <div className="h-4 bg-[#333333] rounded w-4/5 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-3 bg-[#333333] rounded w-16"></div>
                      <div className="h-3 bg-[#333333] rounded w-16"></div>
                      <div className="h-3 bg-[#333333] rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((user) => (
                  <HoverGlowEffect key={user.id}>
                    <div className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        {user.profileImage ? (
                          <Image
                            src={user.profileImage}
                            alt={user.name}
                            width={48}
                            height={48}
                            className="rounded-full mr-3"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-[#333333] rounded-full mr-3 flex items-center justify-center text-[#cccccc]">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-[#ffffff]">{user.name}</h3>
                          <p className="text-[#cccccc] text-sm">@{user.username}</p>
                        </div>
                      </div>
                      
                      <p className="text-[#ffffff]/80 text-sm mb-4 line-clamp-2">
                        {user.description || "No description available"}
                      </p>
                      
                      <div className="flex justify-between text-xs text-[#cccccc]">
                        <span>{user.metrics.followers.toLocaleString()} Followers</span>
                        <span>{user.metrics.following.toLocaleString()} Following</span>
                        <span>{user.metrics.tweets.toLocaleString()} Tweets</span>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-[#f9b72d]/10">
                        <a 
                          href={`https://x.com/${user.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#f9b72d] text-sm hover:underline flex items-center justify-center"
                        >
                          View on X.com →
                        </a>
                      </div>
                    </div>
                  </HoverGlowEffect>
                ))}
              </div>
            ) : query.trim() !== "" && (
              <div className="bg-[#000000]/30 border border-[#f9b72d]/10 p-6 rounded-lg text-center">
                <p className="text-[#cccccc]">No users found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 