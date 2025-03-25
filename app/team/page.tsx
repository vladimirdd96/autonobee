"use client";

import React from "react";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { MeteorEffect } from "@/components/aceternity/meteor-effect";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { MovingBorder } from "@/components/aceternity/moving-border";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { SparklesCore } from "@/components/aceternity/sparkles";
import { TracingBeam } from "@/components/aceternity/tracing-beam";
import { Brain, Cpu, Network, Shield, Image as ImageIcon, PenTool, LineChart, Users, Video } from "lucide-react";

const aiAgents = [
  {
    name: "PixelMaster",
    role: "Image Generation AI",
    bio: "Advanced AI specialized in creating stunning visuals, from photorealistic images to artistic illustrations. Powered by state-of-the-art diffusion models and trained on billions of high-quality images.",
    icon: ImageIcon,
    iconBg: "from-[#f9b72d] via-[#f9b72d]/50 to-[#000000]",
    capabilities: [
      "Photorealistic image generation",
      "Style transfer and adaptation",
      "Image editing and enhancement",
      "Custom art style creation"
    ],
    stats: {
      processingSpeed: "0.2s per image",
      resolution: "4K+",
      styles: "1000+"
    }
  },
  {
    name: "ContentForge",
    role: "Content Creation AI",
    bio: "Sophisticated language model that generates engaging, SEO-optimized content across multiple formats and industries. Adapts tone, style, and complexity based on target audience and platform.",
    icon: PenTool,
    iconBg: "from-[#000000] via-[#f9b72d]/70 to-[#f9b72d]",
    capabilities: [
      "Multi-format content generation",
      "SEO optimization",
      "Tone and style adaptation",
      "Industry-specific expertise"
    ],
    stats: {
      languages: "50+",
      formats: "20+",
      accuracy: "98%"
    }
  },
  {
    name: "TrendAnalyzer",
    role: "Analytics AI",
    bio: "Real-time trend analysis and prediction engine that processes vast amounts of data to identify emerging patterns, opportunities, and potential risks in content performance.",
    icon: LineChart,
    iconBg: "from-[#cccccc] via-[#f9b72d]/60 to-[#000000]",
    capabilities: [
      "Real-time trend detection",
      "Performance prediction",
      "Competitor analysis",
      "Audience insights"
    ],
    stats: {
      dataPoints: "1M+/day",
      accuracy: "95%",
      predictions: "7-day"
    }
  },
  {
    name: "EngageBot",
    role: "Engagement AI",
    bio: "Intelligent engagement monitoring system that analyzes user interactions, sentiment, and behavior patterns to optimize content delivery and maximize audience engagement.",
    icon: Users,
    iconBg: "from-[#f9b72d] via-[#cccccc]/50 to-[#000000]",
    capabilities: [
      "Sentiment analysis",
      "Behavior tracking",
      "Engagement optimization",
      "A/B testing"
    ],
    stats: {
      interactions: "10K+/hour",
      accuracy: "92%",
      responseTime: "<100ms"
    }
  },
  {
    name: "VideoGenius",
    role: "Video Creation AI",
    bio: "Cutting-edge video generation and editing AI that creates professional-quality videos from text descriptions, including motion graphics, transitions, and audio synchronization.",
    icon: Video,
    iconBg: "from-[#000000] via-[#f9b72d]/80 to-[#f9b72d]",
    capabilities: [
      "Text-to-video generation",
      "Motion graphics",
      "Audio synchronization",
      "Style customization"
    ],
    stats: {
      formats: "15+",
      quality: "4K",
      processing: "Real-time"
    }
  }
];

export default function Team() {
  const [selectedAgent, setSelectedAgent] = React.useState<number | null>(null);
  
  return (
    <div className="min-h-screen bg-[#000000] pt-16 overflow-hidden">
      <div className="fixed top-0 left-0 right-0">
        <BackgroundBeams />
      </div>
      <MeteorEffect count={15} color="#f9b72d" className="z-0" />
      <Sidebar />
      <div className="ml-64 px-4 pt-8 relative z-10 w-[calc(100%-16rem)]">
        <div className="max-w-[90%] mx-auto">
          <div className="relative">
            <h1 className="text-4xl font-bold mb-2">
              <AnimatedGradientText text="Our AI Agents" />
            </h1>
            <div className="absolute -top-8 left-0 w-screen h-[100vh] pointer-events-none z-0">
              <div className="absolute top-0 left-0 w-full h-full">
                <SparklesCore
                  background="transparent"
                  minSize={0.4}
                  maxSize={1}
                  particleDensity={300}
                  className="w-full h-full"
                  particleColor="#f9b72d"
                />
              </div>
            </div>
          </div>
          
          <p className="text-[#cccccc]/80 mb-10 max-w-4xl text-lg">
            Meet our advanced AI agents, each specialized in different aspects of content creation and optimization. 
            Together, they form a powerful ecosystem that handles everything from content generation to performance analysis.
          </p>

          <div className="px-2">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
                {aiAgents.map((agent, index) => (
                  <HoverGlowEffect key={index} containerClassName={selectedAgent === index ? "transform scale-105" : ""}>
                    <div 
                      className="cursor-pointer w-full h-[420px]" 
                      onClick={() => setSelectedAgent(index === selectedAgent ? null : index)}
                    >
                      <div className="relative perspective-1000 h-full">
                        <div className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 rounded-xl p-5 h-full flex flex-col">
                          <div className="w-full flex flex-col items-center flex-1">
                            <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${agent.iconBg} mb-3 relative flex items-center justify-center group transition-all duration-300`}>
                              {React.createElement(agent.icon, {
                                className: "w-10 h-10 text-[#ffffff] group-hover:scale-110 transition-transform duration-300",
                                strokeWidth: 1.5
                              })}
                            </div>
                            <h3 className="font-semibold text-[#ffffff] text-lg mb-1 text-center">{agent.name}</h3>
                            <p className="text-[#f9b72d] text-sm mb-2 text-center">{agent.role}</p>
                            <p className="text-[#cccccc]/80 text-xs text-center mb-3 line-clamp-3 flex-none">{agent.bio}</p>
                            <div className="flex flex-wrap gap-1 justify-center mb-3 flex-none">
                              {agent.capabilities.map((capability, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-[#f9b72d]/10 text-[#f9b72d] rounded-full text-xs whitespace-nowrap">
                                  {capability}
                                </span>
                              ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2 w-full text-center mt-auto">
                              {Object.entries(agent.stats).map(([key, value]) => (
                                <div key={key} className="bg-[#000000]/30 rounded-lg p-1.5">
                                  <div className="text-[10px] text-[#cccccc]/70 capitalize leading-tight">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                  <div className="text-xs font-medium text-[#ffffff]">{value}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoverGlowEffect>
                ))}
              </div>
          </div>
          
          {selectedAgent !== null && (
            <div className="mb-12 animate-fade-in w-full">
              <MovingBorder
                borderRadius="0.5rem"
                className="w-full p-1 bg-gradient-to-br from-[#f9b72d] via-[#f9b72d]/50 to-transparent"
              >
                <div className="w-full bg-[#000000]/80 backdrop-blur-sm p-8 rounded-[1.3rem]">
                  <div className="flex flex-col md:flex-row items-start gap-8 w-full">
                    <div className="w-full h-48 md:w-64 md:h-64 rounded-xl bg-gradient-to-br ${aiAgents[selectedAgent].iconBg} flex-shrink-0 relative flex items-center justify-center group transition-all duration-300">
                      {React.createElement(aiAgents[selectedAgent].icon, {
                        className: "w-full h-24 md:w-32 md:h-32 text-[#ffffff] group-hover:scale-110 transition-transform duration-300",
                        strokeWidth: 1.5
                      })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-3xl font-bold text-[#ffffff] mb-3">{aiAgents[selectedAgent].name}</h2>
                      <p className="text-[#f9b72d] text-xl mb-4">{aiAgents[selectedAgent].role}</p>
                      <p className="text-[#cccccc]/80 text-lg mb-8 leading-relaxed">{aiAgents[selectedAgent].bio}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                        <div>
                          <h3 className="text-xl font-semibold text-[#ffffff] mb-4">Capabilities</h3>
                          <div className="space-y-3">
                            {aiAgents[selectedAgent].capabilities.map((capability, idx) => (
                              <div key={idx} className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[#f9b72d]"></div>
                                <span className="text-[#cccccc]/80 text-lg">{capability}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-[#ffffff] mb-4">Performance Stats</h3>
                          <div className="space-y-4">
                            {Object.entries(aiAgents[selectedAgent].stats).map(([key, value]) => (
                              <div key={key} className="bg-[#000000]/20 rounded-lg p-4">
                                <div className="text-base text-[#cccccc]/70 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                <div className="text-xl font-medium text-[#ffffff]">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MovingBorder>
            </div>
          )}
          
          <AuroraBackground 
            className="rounded-xl py-8 px-6"
            position={{ x: 0, y: 0 }}
            primaryColor="#f9b72d"
            secondaryColor="#cccccc"
            size="40%"
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 text-[#ffffff]">AI Ecosystem Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#000000]/20 backdrop-blur-sm p-4 rounded-lg border border-[#f9b72d]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f9b72d]/30 to-[#f9b72d]/10 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-[#f9b72d]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#ffffff]">Neural Processing</h3>
                  </div>
                  <p className="text-[#cccccc]/80 text-sm">Advanced neural networks processing billions of data points in real-time</p>
                </div>
                <div className="bg-[#000000]/20 backdrop-blur-sm p-4 rounded-lg border border-[#f9b72d]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f9b72d]/30 to-[#f9b72d]/10 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-[#f9b72d]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#ffffff]">Quantum Computing</h3>
                  </div>
                  <p className="text-[#cccccc]/80 text-sm">Next-gen quantum processors for lightning-fast content generation</p>
                </div>
                <div className="bg-[#000000]/20 backdrop-blur-sm p-4 rounded-lg border border-[#f9b72d]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f9b72d]/30 to-[#f9b72d]/10 flex items-center justify-center">
                      <Network className="w-5 h-5 text-[#f9b72d]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#ffffff]">Distributed AI</h3>
                  </div>
                  <p className="text-[#cccccc]/80 text-sm">Decentralized AI network for enhanced reliability and scalability</p>
                </div>
                <div className="bg-[#000000]/20 backdrop-blur-sm p-4 rounded-lg border border-[#f9b72d]/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f9b72d]/30 to-[#f9b72d]/10 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[#f9b72d]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#ffffff]">AI Security</h3>
                  </div>
                  <p className="text-[#cccccc]/80 text-sm">Enterprise-grade security with advanced encryption and monitoring</p>
                </div>
              </div>
            </div>
          </AuroraBackground>
        </div>
      </div>
    </div>
  );
} 