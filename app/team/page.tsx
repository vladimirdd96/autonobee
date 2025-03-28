"use client";

import React from "react";
import Image from "next/image";
import Layout from "@/components/Layout";
import { MeteorEffect } from "@/components/aceternity/meteor-effect";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { MovingBorder } from "@/components/aceternity/moving-border";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { SparklesCore } from "@/components/aceternity/sparkles";
import { TracingBeam } from "@/components/aceternity/tracing-beam";
import { Brain, Cpu, Network, Shield, Image as ImageIcon, PenTool, LineChart, Users, Video } from "lucide-react";
import { Sparkles } from "@/components/aceternity/sparkles";

const aiAgents = [
  {
    name: "Content Creator",
    description: "Generates engaging social media content and blog posts",
    icon: PenTool,
    color: "text-blue-500"
  },
  {
    name: "Analytics Expert",
    description: "Analyzes data and provides actionable insights",
    icon: LineChart,
    color: "text-green-500"
  },
  {
    name: "Community Manager",
    description: "Engages with followers and manages social media presence",
    icon: Users,
    color: "text-purple-500"
  },
  {
    name: "Visual Designer",
    description: "Creates stunning visuals and graphics",
    icon: ImageIcon,
    color: "text-pink-500"
  },
  {
    name: "Video Editor",
    description: "Produces and edits video content",
    icon: Video,
    color: "text-red-500"
  },
  {
    name: "AI Assistant",
    description: "Helps with various tasks using AI",
    icon: Brain,
    color: "text-yellow-500"
  }
];

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "John Doe",
    role: "Founder & CEO",
    bio: "Passionate about AI and its potential to transform businesses.",
    image: "/images/team/john.jpg",
    social: {
      twitter: "https://twitter.com/johndoe",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe"
    }
  },
  {
    name: "Jane Smith",
    role: "Head of Product",
    bio: "Product strategist with a focus on user experience and innovation.",
    image: "/images/team/jane.jpg",
    social: {
      twitter: "https://twitter.com/janesmith",
      linkedin: "https://linkedin.com/in/janesmith"
    }
  },
  {
    name: "Mike Johnson",
    role: "Lead Developer",
    bio: "Full-stack developer with expertise in AI and blockchain.",
    image: "/images/team/mike.jpg",
    social: {
      github: "https://github.com/mikejohnson",
      linkedin: "https://linkedin.com/in/mikejohnson"
    }
  }
];

export default function Team() {
  return (
    <Layout>
      <div className="min-h-screen bg-background overflow-hidden">
        <MeteorEffect count={5} color="#f9b72d" className="z-0" />
        <div className="pt-8 relative z-10">
          <h1 className="text-3xl font-bold mb-6">
            <Sparkles color="#f9b72d" count={4}>
              <AnimatedGradientText text="Our Team" />
            </Sparkles>
          </h1>

          {/* AI Agents Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-accent mb-6">AI Agents</h2>
            <TracingBeam className="px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiAgents.map((agent, index) => (
                  <div 
                    key={index}
                    className="bg-background/20 backdrop-blur-sm border border-primary/10 rounded-xl p-6 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ${agent.color}`}>
                        <agent.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-accent">{agent.name}</h3>
                        <p className="text-accent/60 text-sm">{agent.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TracingBeam>
          </div>

          {/* Team Members Section */}
          <div>
            <h2 className="text-2xl font-bold text-accent mb-6">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="bg-background/20 backdrop-blur-sm border border-primary/10 rounded-xl p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary/20">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-accent mb-1">{member.name}</h3>
                    <p className="text-primary mb-3">{member.role}</p>
                    <p className="text-accent/80 mb-4">{member.bio}</p>
                    <div className="flex gap-4">
                      {member.social.twitter && (
                        <a 
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent/60 hover:text-primary transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </a>
                      )}
                      {member.social.linkedin && (
                        <a 
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent/60 hover:text-primary transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </a>
                      )}
                      {member.social.github && (
                        <a 
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent/60 hover:text-primary transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </a>
                      )}
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