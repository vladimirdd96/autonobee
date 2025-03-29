"use client";

import React, { useEffect, Suspense } from "react";
import Image from "next/image";
import Layout from "@/components/Layout";
import { MeteorEffect } from "@/components/aceternity/meteor-effect";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { Sparkles } from "@/components/aceternity/sparkles";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { teamMembers, TeamMember } from "@/utils/team-members";
import { useSearchParams } from "next/navigation";

function TeamContent() {
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams) return;
    
    const agentParam = searchParams.get('agent');
    if (agentParam) {
      const foundMember = teamMembers.find(
        member => member.name.toLowerCase() === decodeURIComponent(agentParam).toLowerCase()
      );
      if (foundMember) {
        setSelectedMember(foundMember);
      }
    }
  }, [searchParams]);

  const openModal = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
    // Remove the query parameter when closing the modal
    const url = new URL(window.location.href);
    url.searchParams.delete('agent');
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <MeteorEffect count={5} color="#f9b72d" className="z-0" />
      <div className="pt-8 relative z-10">
        <h1 className="text-3xl font-bold mb-6">
          <Sparkles color="#f9b72d" count={4}>
            <AnimatedGradientText text="AI Agents" />
          </Sparkles>
        </h1>

        {/* Team Members Section */}
        <div>
          <h2 className="text-2xl font-bold text-accent mb-6">AI Agents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-background/20 backdrop-blur-sm border border-primary/10 rounded-xl p-6 hover:border-primary/30 transition-colors cursor-pointer hover:shadow-md hover:shadow-primary/10 group"
                onClick={() => setSelectedMember(member)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-primary/20 group-hover:border-primary/40 transition-colors">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-accent mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                  <p className="text-primary mb-3">{member.role}</p>
                  <p className="text-accent/80 mb-4">{member.bio}</p>
                  <span className="text-xs text-primary/60 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">Click to view details</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[50]"
              onClick={closeModal}
            />
            
            {/* Modal Container - using flex to center content */}
            <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-background rounded-2xl shadow-xl m-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto pointer-events-auto"
              >
                <div className="relative p-6">
                  <motion.button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-accent/60 hover:text-primary"
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 flex-shrink-0"
                    >
                      <img 
                        src={selectedMember.image} 
                        alt={selectedMember.name}
                        className="w-full h-full object-contain"
                      />
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.h2 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-accent mb-2"
                      >
                        {selectedMember.name}
                      </motion.h2>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.3 }}
                        className="text-primary text-lg mb-4"
                      >
                        {selectedMember.role}
                      </motion.p>
                      
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.4 }}
                        className="text-accent/80 mb-6"
                      >
                        {selectedMember.bio}
                      </motion.p>
                    </div>
                  </div>
                  
                  {/* Additional Details for Modal */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 bg-primary/5 p-6 rounded-xl"
                  >
                    <h3 className="text-lg font-bold text-accent mb-4">Capabilities</h3>
                    <ul className="list-disc list-inside space-y-2 text-accent/80">
                      {selectedMember.role.includes("Content Creation") && (
                        <>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>Create engaging social media content optimized for each platform</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>Generate blog posts with SEO optimization</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>Craft compelling email newsletters</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>Develop content strategies aligned with brand goals</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>Adapt content for different audience segments</motion.li>
                        </>
                      )}
                      
                      {selectedMember.role.includes("Data Analysis") && (
                        <>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>Track and analyze content performance metrics</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>Identify audience behavior patterns</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>Generate custom reports with actionable insights</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>Compare performance across platforms</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>Predict content trends based on historical data</motion.li>
                        </>
                      )}
                      
                      {(selectedMember.role.includes("Community Management") || selectedMember.role.includes("Social Media")) && (
                        <>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>Engage with followers across social platforms</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>Monitor and respond to comments and messages</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>Build and nurture community relationships</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>Manage online reputation and brand sentiment</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>Coordinate community events and campaigns</motion.li>
                        </>
                      )}
                      
                      {selectedMember.role.includes("Visual Design") && (
                        <>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>Create stunning visuals for social media</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>Design infographics and data visualizations</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>Develop brand-consistent image templates</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>Edit and enhance photos for maximum impact</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>Create animated graphics and visual effects</motion.li>
                        </>
                      )}
                      
                      {selectedMember.role.includes("AI Assistant") && (
                        <>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>Automate routine tasks and workflows</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>Provide intelligent recommendations</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>Answer questions and provide information instantly</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 }}>Schedule and manage appointments</motion.li>
                          <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}>Enhance productivity through AI-powered solutions</motion.li>
                        </>
                      )}
                    </ul>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Team() {
  return (
    <Layout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading team data...</div>}>
        <TeamContent />
      </Suspense>
    </Layout>
  );
} 