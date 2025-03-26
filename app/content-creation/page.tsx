"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import { MeteorEffect } from "@/components/aceternity/meteor-effect";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { MovingBorder } from "@/components/aceternity/moving-border";
import { Sparkles } from "@/components/aceternity/sparkles";
import { TextRevealCard } from "@/components/aceternity/text-reveal-card";
import Image from "next/image";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { useAuth } from '@/contexts/AuthContext';
import { Lock } from 'lucide-react';

const ErrorNotification = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-4 right-4 z-50"
      >
        <div className="relative">
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-4 shadow-lg max-w-md">
            <div className="flex items-start gap-3 text-red-500">
              <div className="mt-1">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Generation Error</h3>
                <div className="text-sm text-red-500/80 space-y-1">
                  <p>{message}</p>
                  {message.includes("length") && (
                    <div className="mt-2 p-2 bg-red-500/5 rounded-lg border border-red-500/10">
                      <p className="text-xs font-medium mb-1">Tips:</p>
                      <ul className="text-xs list-disc list-inside space-y-1">
                        <li>Try adjusting your content length selection</li>
                        <li>Reduce the number of hashtags or emojis</li>
                        <li>Simplify your message while maintaining key points</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-red-500/60 hover:text-red-500 transition-colors p-1 hover:bg-red-500/10 rounded-lg"
              >
                <motion.div
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.div>
              </button>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute inset-0 -z-10 bg-red-500/10 rounded-xl blur-xl"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function ContentCreation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    contentType: "twitter",
    topic: "",
    tone: "Professional",
    keywords: "",
    length: "medium",
    instructions: "",
    includeHashtags: true,
    includeEmojis: true,
    twitterTemplate: "announcement",
    schedulePost: false,
    scheduleDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    scheduleTime: "12:00"
  });
  
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mediaAttachments, setMediaAttachments] = useState<string[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isXAuthorized, authorizeX } = useAuth();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleRadioChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, tone: value }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setAiSuggestions([]);
    setShowSuggestions(false);
    setError(null);
    
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedContent(data.content);
      setCharCount(data.content.length);
      setAiSuggestions(data.suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [formData]);

  const analyzePost = useCallback(() => {
    if (!generatedContent) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const suggestions = [];
      
      if (formData.contentType === "twitter") {
        if (charCount > 240) {
          suggestions.push("Your post is approaching Twitter's character limit. Consider shortening it for better readability.");
        }
        
        if (!formData.includeHashtags) {
          suggestions.push("Adding relevant hashtags could increase your post's visibility.");
        } else if (formData.keywords.split(',').length < 3) {
          suggestions.push("Consider adding more relevant keywords to generate better hashtags.");
        }
        
        if (!generatedContent.includes('?') && formData.twitterTemplate !== 'question') {
          suggestions.push("Adding a question could boost engagement by encouraging responses.");
        }
        
        if (!formData.includeEmojis) {
          suggestions.push("Tweets with emojis often see higher engagement rates.");
        }
        
        const randomSuggestions = [
          "Posts published in the early morning or early evening typically receive more engagement.",
          "Try adding a call-to-action to encourage clicks, likes, or retweets.",
          "Consider mentioning a trending topic related to your content to boost visibility.",
          "Images and media increase engagement by up to 150% on Twitter.",
          "Frame your content as a solution to a common problem your audience faces."
        ];
        
        const randomCount = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < randomCount; i++) {
          const randomIndex = Math.floor(Math.random() * randomSuggestions.length);
          suggestions.push(randomSuggestions[randomIndex]);
          randomSuggestions.splice(randomIndex, 1);
        }
      }
      
      setAiSuggestions(suggestions);
      setShowSuggestions(true);
      setIsAnalyzing(false);
    }, 1500);
  }, [generatedContent, formData, charCount]);


  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedContent);
    alert("Content copied to clipboard!");
  }, [generatedContent]);

  const handleDownload = useCallback(() => {
    const element = document.createElement("a");
    const file = new Blob([generatedContent], {type: "text/plain"});
    element.href = URL.createObjectURL(file);
    element.download = `${formData.title || formData.topic || "generated-content"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }, [generatedContent, formData.title, formData.topic]);

  const handleMediaUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).slice(0, 4 - mediaAttachments.length);
      
      if (newFiles.length > 0) {
        newFiles.forEach(file => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setMediaAttachments(prev => [...prev, event.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        });
      }
    }
  }, [mediaAttachments.length]);

  const removeAttachment = useCallback((index: number) => {
    setMediaAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleHashtagClick = useCallback((hashtag: string) => {
    setFormData(prev => ({ 
      ...prev, 
      keywords: prev.keywords ? `${prev.keywords}, ${hashtag}` : hashtag 
    }));
  }, []);

  const handleScheduleToggle = useCallback(() => {
    setFormData(prev => ({ ...prev, schedulePost: !prev.schedulePost }));
  }, []);

  const handleSchedulePublish = useCallback(() => {
    const scheduledTime = new Date(`${formData.scheduleDate}T${formData.scheduleTime}`);
    const now = new Date();
    const timeUntilPost = scheduledTime.getTime() - now.getTime();
    
    if (timeUntilPost <= 0) {
      alert("Please select a future date and time.");
      return;
    }
    
    alert(`Your post has been scheduled for ${scheduledTime.toLocaleString()}`);
  }, [formData.scheduleDate, formData.scheduleTime]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  }, [handleSubmit]);

  // Memoize content type options
  const contentTypeOptions = useMemo(() => [
    { 
      value: "twitter", 
      label: "X (Twitter)", 
      available: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    { 
      value: "instagram", 
      label: "Instagram", 
      available: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="currentColor" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.136 5.136 0 1 1 0 10.272 5.136 5.136 0 0 1 0-10.272zm0 8.47a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.684a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
        </svg>
      )
    },
    { 
      value: "facebook", 
      label: "Facebook", 
      available: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="currentColor" d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
        </svg>
      )
    },
    { 
      value: "tiktok", 
      label: "TikTok", 
      available: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
          <path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      )
    }
  ], []);

  // Memoize tone options
  const toneOptions = useMemo(() => ['Professional', 'Casual', 'Humorous', 'Formal', 'Inspirational', 'Technical'], []);

  useEffect(() => {
    if (generatedContent) {
      setCharCount(generatedContent.length);
    }
  }, [generatedContent]);

  // Simulated trending hashtags (would be fetched from an API in production)
  useEffect(() => {
    const generateTrendingHashtags = () => {
      const baseTags = ["Tech", "AI", "Innovation", "DigitalMarketing", "SocialMedia", "Growth", "Leadership"];
      const topicalTags: string[] = [];
      
      if (formData.topic) {
        const words = formData.topic.split(' ');
        words.forEach(word => {
          if (word.length > 3) {
            topicalTags.push(word.replace(/[^a-zA-Z0-9]/g, ''));
          }
        });
      }
      
      if (formData.keywords) {
        const keywordsList = formData.keywords.split(',');
        keywordsList.forEach(keyword => {
          const words = keyword.trim().split(' ');
          if (words.length === 1 && words[0].length > 3) {
            topicalTags.push(words[0].replace(/[^a-zA-Z0-9]/g, ''));
          }
        });
      }
      
      const allTags = [...new Set([...baseTags, ...topicalTags])];
      const count = Math.floor(Math.random() * 3) + 5;
      const shuffled = allTags.sort(() => 0.5 - Math.random());
      setTrendingHashtags(shuffled.slice(0, count));
    };
    
    generateTrendingHashtags();
  }, [formData.topic, formData.keywords]);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <>
      {error && <ErrorNotification message={error} onClose={handleDismissError} />}
      <Layout>
        <div className="relative">
          {!isXAuthorized && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-accent mb-2">X Authorization Required</h3>
                <p className="text-accent/80 mb-6">Please authorize your X account to access the content creation features.</p>
                <button
                  onClick={authorizeX}
                  className="px-6 py-3 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Authorize
                </button>
              </div>
            </div>
          )}
          
          <div className="min-h-screen bg-background overflow-hidden">
            <MeteorEffect count={5} color="#f9b72d" className="z-0" />
            <div className="pt-8 relative z-10">
              <h1 className="text-3xl font-bold mb-6">
                <Sparkles color="#f9b72d" count={4}>
                  <AnimatedGradientText text="Content Creation" />
                </Sparkles>
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Left Column - Form */}
                <div className="lg:col-span-1 h-full flex flex-col">
                  <div className="w-full h-full flex flex-col">
                    <div className="bg-background/20 backdrop-blur-sm border border-primary/10 rounded-xl p-6 flex flex-col flex-grow h-full">
                      <form onSubmit={handleSubmit} className="space-y-5 flex flex-col h-full">
                        <div className="flex-grow overflow-y-auto">
                          <div className="mb-5">
                            <div>
                              <label className="block text-accent mb-2 font-medium">Title</label>
                              <input 
                                type="text" 
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter a title" 
                                className="w-full p-3 bg-background/50 border border-accent/30 rounded-lg text-accent focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                              />
                            </div>
                          </div>
                          
                          <div className="mb-5">
                            <div>
                              <label className="block text-accent mb-2 font-medium">Content Type</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {contentTypeOptions.map((option) => (
                                  <div 
                                    key={option.value} 
                                    onClick={() => option.available && setFormData(prev => ({ ...prev, contentType: option.value }))}
                                    className={`relative ${option.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                                  >
                                    <div 
                                      className={`text-center p-3 rounded-lg transition-all ${formData.contentType === option.value ? 'bg-primary/20 border-2 border-primary/50' : 'bg-background/30 border border-accent/10'}`}
                                    >
                                      <div className="flex items-center justify-center gap-2">
                                        <span className="text-accent">{option.icon}</span>
                                        <span>{option.label}</span>
                                        {!option.available && <span className="text-xs text-accent/60">(Coming Soon)</span>}
                                      </div>
                                    </div>
                                    {!option.available && (
                                      <div className="absolute top-1 right-1 bg-primary/80 text-xs text-black px-1 rounded-sm">
                                        Soon
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-5">
                            <div>
                              <label className="block text-accent mb-2 font-medium">Topic</label>
                              <input 
                                type="text" 
                                name="topic"
                                value={formData.topic}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter a topic" 
                                className="w-full p-3 bg-background/50 border border-accent/30 rounded-lg text-accent focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                              />
                            </div>
                          </div>
                          
                          {formData.contentType === "twitter" && (
                            <div className="mb-5">
                              <div>
                                <label className="block text-accent mb-2 font-medium">Post Template</label>
                                <div className="grid grid-cols-2 gap-2">
                                  {["announcement", "question", "tip", "poll"].map((template) => (
                                    <div 
                                      key={template} 
                                      onClick={() => setFormData(prev => ({ ...prev, twitterTemplate: template }))}
                                      className={`cursor-pointer p-2 rounded-lg transition-all text-center capitalize ${formData.twitterTemplate === template ? 'bg-primary/20 border-2 border-primary/50' : 'bg-background/30 border border-accent/10'}`}
                                    >
                                      <span className="text-accent/80 text-sm">{template}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mb-5">
                            <div>
                              <label className="block text-accent mb-2 font-medium">Keywords</label>
                              <input 
                                type="text" 
                                name="keywords"
                                value={formData.keywords}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter keywords (comma separated)" 
                                className="w-full p-3 bg-background/50 border border-accent/30 rounded-lg text-accent focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                              />
                              {formData.contentType === "twitter" && trendingHashtags.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-xs text-accent/70 mb-1">Trending Hashtags:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {trendingHashtags.map(tag => (
                                      <div 
                                        key={tag} 
                                        onClick={() => handleHashtagClick(tag)}
                                        className="bg-primary/10 text-primary text-xs px-2 py-1 rounded cursor-pointer hover:bg-primary/20 transition-colors"
                                      >
                                        #{tag}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mb-5">
                            <div>
                              <label className="block text-accent mb-2 font-medium">Tone</label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {toneOptions.map((tone) => (
                                  <div 
                                    key={tone} 
                                    onClick={() => handleRadioChange(tone)}
                                    className={`cursor-pointer p-2 rounded-lg transition-all text-center ${formData.tone === tone ? 'bg-primary/20 border-2 border-primary/50' : 'bg-background/30 border border-accent/10'}`}
                                  >
                                    <span className="text-accent/80 text-sm">{tone}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          {formData.contentType === "twitter" && (
                            <div className="mb-5">
                              <div>
                                <label className="block text-accent mb-2 font-medium">Formatting</label>
                                <div className="grid grid-cols-2 gap-2">
                                  <div 
                                    onClick={() => setFormData(prev => ({ ...prev, includeHashtags: !prev.includeHashtags }))}
                                    className={`cursor-pointer p-2 rounded-lg transition-all flex items-center justify-between ${formData.includeHashtags ? 'bg-primary/20 border-2 border-primary/50' : 'bg-background/30 border border-accent/10'}`}
                                  >
                                    <span className="text-accent/80 text-sm">Include Hashtags</span>
                                    <div className={`w-4 h-4 rounded-sm border ${formData.includeHashtags ? 'bg-primary border-primary' : 'border-accent/50'}`}>
                                      {formData.includeHashtags && <span className="text-black text-xs flex items-center justify-center">✓</span>}
                                    </div>
                                  </div>
                                  <div 
                                    onClick={() => setFormData(prev => ({ ...prev, includeEmojis: !prev.includeEmojis }))}
                                    className={`cursor-pointer p-2 rounded-lg transition-all flex items-center justify-between ${formData.includeEmojis ? 'bg-primary/20 border-2 border-primary/50' : 'bg-background/30 border border-accent/10'}`}
                                  >
                                    <span className="text-accent/80 text-sm">Include Emojis</span>
                                    <div className={`w-4 h-4 rounded-sm border ${formData.includeEmojis ? 'bg-primary border-primary' : 'border-accent/50'}`}>
                                      {formData.includeEmojis && <span className="text-black text-xs flex items-center justify-center">✓</span>}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {formData.contentType === "twitter" && (
                            <div className="mb-5">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <label className="block text-accent font-medium">Media</label>
                                  <button
                                    type="button"
                                    onClick={() => setShowMediaUpload(!showMediaUpload)}
                                    className="text-primary text-sm hover:underline flex items-center gap-1"
                                  >
                                    {showMediaUpload ? (
                                      <>Hide</>
                                    ) : (
                                      <>Add Media</>
                                    )}
                                  </button>
                                </div>
                                
                                {showMediaUpload && (
                                  <div className="mt-2 p-3 bg-background/30 rounded-lg border border-primary/20">
                                    <div className="mb-3">
                                      <p className="text-accent/70 text-xs mb-2">Add up to 4 images to increase engagement (PNG, JPG)</p>
                                      <label className={`flex items-center justify-center p-4 border-2 border-dashed border-accent/20 rounded-lg cursor-pointer hover:border-primary/30 transition-colors ${mediaAttachments.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        <input 
                                          type="file" 
                                          accept="image/*" 
                                          multiple 
                                          onChange={handleMediaUpload} 
                                          className="hidden"
                                          disabled={mediaAttachments.length >= 4}
                                        />
                                        <div className="flex flex-col items-center">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                          </svg>
                                          <span className="text-xs text-accent/60 mt-1">Click to upload</span>
                                        </div>
                                      </label>
                                    </div>
                                    
                                    {mediaAttachments.length > 0 && (
                                      <div className={`grid ${mediaAttachments.length === 1 ? 'grid-cols-1' : mediaAttachments.length === 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-2`}>
                                        {mediaAttachments.map((src, index) => (
                                          <div key={index} className="relative group">
                                            <img 
                                              src={src} 
                                              alt={`Attachment ${index + 1}`} 
                                              className="w-full h-24 object-cover rounded-lg border border-accent/10"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => removeAttachment(index)}
                                              className="absolute top-1 right-1 bg-black/70 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                              </svg>
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          <div className="mb-5">
                            <div>
                              <label className="block text-accent mb-2 font-medium">Length</label>
                              <select 
                                name="length"
                                value={formData.length}
                                onChange={handleChange}
                                className="w-full p-3 bg-background/50 border border-accent/30 rounded-lg text-accent focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                              >
                                <option value="short">Short (100-150 characters)</option>
                                <option value="medium">Medium (150-200 characters)</option>
                                <option value="long">Long (200-280 characters)</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="mb-5">
                            <div>
                              <label className="block text-accent mb-2 font-medium">Additional Instructions</label>
                              <textarea 
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Add any specific instructions or details" 
                                rows={3}
                                className="w-full p-3 bg-background/50 border border-accent/30 rounded-lg text-accent focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-auto pt-2">
                          <MovingBorder borderRadius="0.5rem" className="w-full" containerClassName="w-full">
                            <button 
                              type="submit" 
                              className="w-full py-3 bg-background text-primary font-medium rounded-md hover:bg-primary/10 transition-colors flex items-center justify-center"
                              disabled={isGenerating}
                            >
                              {isGenerating ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  Generate Content
                                </>
                              )}
                            </button>
                          </MovingBorder>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Preview */}
                <div className="lg:col-span-1 h-[calc(100vh-16rem)]">
                  <div className="w-full h-full">
                    <div className="bg-background/20 backdrop-blur-sm border border-primary/10 rounded-xl p-6 h-full flex flex-col">
                      {/* Header - Fixed */}
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-accent">
                          <AnimatedGradientText text="Preview" />
                        </h2>
                        <div className="flex space-x-2">
                          {formData.contentType === "twitter" && (
                            <div className={`text-xs px-2 py-1 rounded ${charCount > 280 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                              {charCount}/280
                            </div>
                          )}
                          <button 
                            onClick={handleCopy}
                            disabled={!generatedContent}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors text-sm disabled:opacity-50"
                          >
                            Copy
                          </button>
                          <button 
                            onClick={handleDownload}
                            disabled={!generatedContent}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors text-sm disabled:opacity-50"
                          >
                            Download
                          </button>
                        </div>
                      </div>

                      {/* Content Area - Scrollable */}
                      <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto">
                          {generatedContent ? (
                            <div className="space-y-4">
                              {formData.contentType === "twitter" && (
                                <div className="bg-background/50 border border-accent/20 rounded-xl p-4">
                                  <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                      <span className="text-primary font-bold">A</span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center">
                                        <span className="font-bold text-accent">AutonoBee</span>
                                        <span className="text-accent/60 text-sm ml-2">@AutonoBee</span>
                                      </div>
                                      <div className="text-accent mt-1 whitespace-pre-wrap">{generatedContent}</div>
                                      
                                      {mediaAttachments.length > 0 && (
                                        <div className={`mt-3 grid ${mediaAttachments.length === 1 ? 'grid-cols-1' : mediaAttachments.length === 2 ? 'grid-cols-2' : 'grid-cols-2'} gap-2 rounded-xl overflow-hidden border border-accent/10`}>
                                          {mediaAttachments.map((src, index) => (
                                            <div key={index} className={`${mediaAttachments.length > 2 && index >= 2 ? 'h-24' : 'h-48'}`}>
                                              <img 
                                                src={src} 
                                                alt={`Attachment ${index + 1}`} 
                                                className="w-full h-full object-cover"
                                              />
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                      
                                      <div className="flex items-center gap-5 mt-3 text-accent/60">
                                        <div className="flex items-center gap-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                          </svg>
                                          <span className="text-xs">42</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                          </svg>
                                          <span className="text-xs">12</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                          </svg>
                                          <span className="text-xs">124</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="mt-4">
                                {!showSuggestions ? (
                                  <button
                                    onClick={analyzePost}
                                    disabled={isAnalyzing}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-md hover:bg-primary/20 transition-colors w-full justify-center"
                                  >
                                    {isAnalyzing ? (
                                      <>
                                        <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Analyzing your post...
                                      </>
                                    ) : (
                                      <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        Analyze with AI Assistant
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <div className="bg-background/50 border border-primary/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                      </svg>
                                      <h3 className="text-accent font-medium">AI Engagement Assistant</h3>
                                      <button 
                                        onClick={() => setShowSuggestions(false)}
                                        className="ml-auto text-accent/60 hover:text-accent"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </div>
                                    {aiSuggestions.length > 0 ? (
                                      <ul className="space-y-2">
                                        {aiSuggestions.map((suggestion, i) => (
                                          <li key={i} className="flex items-start gap-2 text-sm text-accent/80">
                                            <div className="text-primary mt-0.5">•</div>
                                            <div>{suggestion}</div>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-accent/80 text-sm">Your post looks great! No suggestions at this time.</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center">
                              <div>
                                <Image 
                                  src="/images/ai-writing.jpg" 
                                  alt="AI Writing" 
                                  width={300}
                                  height={200}
                                  className="rounded-lg mb-4"
                                  unoptimized
                                />
                              </div>
                              <p className="text-accent/60 text-center mt-4">Your generated content will appear here</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Schedule Post Section - Fixed at bottom */}
                      {formData.contentType === "twitter" && (
                        <div className="mt-6 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-accent font-medium">Schedule Post</label>
                            <div 
                              onClick={generatedContent ? handleScheduleToggle : undefined}
                              className={`w-10 h-5 rounded-full relative transition-colors ${generatedContent ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} ${formData.schedulePost ? 'bg-primary' : 'bg-accent/30'}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all ${formData.schedulePost ? 'right-0.5' : 'left-0.5'}`}></div>
                            </div>
                          </div>
                          
                          {formData.schedulePost && generatedContent && (
                            <div className="p-3 bg-background/30 rounded-lg border border-primary/20 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-accent/80 text-xs mb-1">Date</label>
                                  <input 
                                    type="date" 
                                    name="scheduleDate"
                                    value={formData.scheduleDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full p-2 bg-background/50 border border-accent/30 rounded-lg text-accent text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                  />
                                </div>
                                <div>
                                  <label className="block text-accent/80 text-xs mb-1">Time</label>
                                  <input 
                                    type="time" 
                                    name="scheduleTime"
                                    value={formData.scheduleTime}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-background/50 border border-accent/30 rounded-lg text-accent text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                                  />
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={handleSchedulePublish}
                                className="w-full py-2 bg-primary/10 text-primary text-sm font-medium rounded-md hover:bg-primary/20 transition-colors"
                              >
                                Schedule Publish
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Platform Post Buttons - Fixed at bottom */}
                      <div className="mt-6 grid grid-cols-4 gap-2">
                        {/* X (Twitter) Button */}
                        <button
                          onClick={() => alert('Posting to X...')}
                          disabled={!generatedContent}
                          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                            generatedContent 
                              ? 'bg-primary text-background hover:bg-primary/90' 
                              : 'bg-accent/30 text-accent/50 cursor-not-allowed'
                          }`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                            <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                          <span className="text-sm font-medium">Post</span>
                        </button>

                        {/* Instagram Button */}
                        <div className="relative group">
                          <button
                            disabled
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-accent/30 text-accent/50 rounded-md cursor-not-allowed w-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                              <path fill="currentColor" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.987-.01 4.04-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.684.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.136 5.136 0 1 1 0 10.272 5.136 5.136 0 0 1 0-10.272zm0 8.47a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.684a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                            </svg>
                            <span className="text-sm font-medium">Post</span>
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Coming Soon
                          </div>
                        </div>

                        {/* Facebook Button */}
                        <div className="relative group">
                          <button
                            disabled
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-accent/30 text-accent/50 rounded-md cursor-not-allowed w-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                              <path fill="currentColor" d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
                            </svg>
                            <span className="text-sm font-medium">Post</span>
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Coming Soon
                          </div>
                        </div>

                        {/* TikTok Button */}
                        <div className="relative group">
                          <button
                            disabled
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-accent/30 text-accent/50 rounded-md cursor-not-allowed w-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                              <path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                            </svg>
                            <span className="text-sm font-medium">Post</span>
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            Coming Soon
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
} 