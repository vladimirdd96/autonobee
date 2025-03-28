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
import { Lock, Settings, Loader2, Wand2 } from 'lucide-react';
import JSZip from 'jszip';

interface FormData {
  title: string;
  contentType: string;
  topic: string;
  tone: string;
  keywords: string;
  length: string;
  instructions: string;
  includeHashtags: boolean;
  includeEmojis: boolean;
  twitterTemplate: string;
  schedulePost: boolean;
  scheduleDate: string;
  scheduleTime: string;
  generateImage: boolean;
  content: string;
}

const ErrorNotification = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
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

const SuccessNotification = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="relative">
          <div className="bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 shadow-lg max-w-md">
            <div className="flex items-start gap-3 text-green-500">
              <div className="mt-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className="font-medium mb-1">Success</h3>
                <p className="text-sm text-green-500/80">{message}</p>
              </div>
              <button 
                onClick={onClose}
                className="text-green-500/60 hover:text-green-500 transition-colors p-1 hover:bg-green-500/10 rounded-lg"
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
            className="absolute inset-0 -z-10 bg-green-500/10 rounded-xl blur-xl"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function ContentCreation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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
    scheduleTime: "12:00",
    generateImage: false,
    content: ""
  });
  
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [charCount, setCharCount] = useState(0);
  const [trendingHashtags, setTrendingHashtags] = useState<string[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mediaAttachments, setMediaAttachments] = useState<string[]>([]);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isXAuthorized, authorizeX } = useAuth();
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
    setError(null);
    setGeneratedImageUrl(null);
    setGeneratedContent("");
    setAiSuggestions([]);
    setShowSuggestions(false);
    
    try {
      // Generate both content and image in parallel if image generation is enabled
      const contentPromise = fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }).then(res => res.json());

      const imagePromise = formData.generateImage ? fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic,
          title: formData.title,
          keywords: formData.keywords,
          tone: formData.tone,
          contentType: formData.contentType
        }),
      }).then(res => res.json()) : Promise.resolve(null);

      // Wait for both to complete
      const [contentData, imageData] = await Promise.all([contentPromise, imagePromise]);
      
      if (contentData.error) {
        throw new Error(contentData.error);
      }

      if (imageData?.error) {
        throw new Error(imageData.error);
      }

      setGeneratedContent(contentData.content);
      setCharCount(contentData.content.length);

      if (imageData) {
        setGeneratedImageUrl(imageData.imageUrl);
      }
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
    setShowSuggestions(true);
    
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
      setIsAnalyzing(false);
    }, 1500);
  }, [generatedContent, formData, charCount]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedContent);
    setSuccessMessage("Content copied to clipboard!");
  }, [generatedContent]);

  const handleDownload = useCallback(async () => {
    try {
      // Create a zip file
      const zip = new JSZip();
      
      // Add text content
      zip.file(`${formData.title || formData.topic || "generated-content"}.txt`, generatedContent);
      
      // Add image if exists
      if (generatedImageUrl) {
        const imageResponse = await fetch(generatedImageUrl);
        const imageBlob = await imageResponse.blob();
        zip.file("generated-image.png", imageBlob);
      }
      
      // Generate and download zip
      const content = await zip.generateAsync({ type: "blob" });
      const element = document.createElement("a");
      element.href = URL.createObjectURL(content);
      element.download = `${formData.title || formData.topic || "generated-content"}.zip`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setSuccessMessage("Content downloaded successfully!");
    } catch (error) {
      console.error('Error downloading content:', error);
      setError("Failed to download content. Please try again.");
    }
  }, [generatedContent, generatedImageUrl, formData.title, formData.topic]);

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

  const handleSchedulePublish = useCallback(async () => {
    const scheduledTime = new Date(`${formData.scheduleDate}T${formData.scheduleTime}`);
    const now = new Date();
    const timeUntilPost = scheduledTime.getTime() - now.getTime();
    
    if (timeUntilPost <= 0) {
      setError("Please select a future date and time.");
      return;
    }

    setIsPosting(true);
    setPostError(null);

    try {
      // First, handle the image if it exists
      let mediaId: string | undefined;
      
      if (generatedImageUrl) {
        try {
          const imageResponse = await fetch(generatedImageUrl);
          if (!imageResponse.ok) throw new Error('Failed to download image');
          
          const imageBlob = await imageResponse.blob();
          const formData = new FormData();
          formData.append('media', imageBlob, 'generated-image.png');

          const uploadResponse = await fetch('/api/upload-media', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) throw new Error('Failed to upload image');

          const uploadData = await uploadResponse.json();
          if (uploadData.error) throw new Error(uploadData.error);
          
          mediaId = uploadData.mediaId;
        } catch (imageError) {
          console.error('Error handling image:', imageError);
          setPostError('Failed to process image, but will attempt to schedule post');
        }
      }

      // Schedule the post
      const scheduleResponse = await fetch('/api/schedule-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: generatedContent,
          mediaId,
          scheduledTime: scheduledTime.toISOString(),
        }),
      });

      if (!scheduleResponse.ok) {
        const errorData = await scheduleResponse.json();
        throw new Error(errorData.error || 'Failed to schedule post');
      }

      // Clear the form and generated content
      setFormData(prev => ({
        ...prev,
        title: "",
        topic: "",
        keywords: "",
        instructions: "",
        generateImage: false,
        schedulePost: false // Close the schedule dropdown
      }));
      setGeneratedContent("");
      setGeneratedImageUrl(null);
      setCharCount(0);
      setAiSuggestions([]);
      setShowSuggestions(false);
      
      // Show success message
      setSuccessMessage(`Your post has been scheduled for ${scheduledTime.toLocaleString()}`);
    } catch (error) {
      console.error('Error scheduling post:', error);
      setPostError(error instanceof Error ? error.message : 'Failed to schedule post');
    } finally {
      setIsPosting(false);
    }
  }, [formData.scheduleDate, formData.scheduleTime, generatedContent, generatedImageUrl]);

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

  const handlePostToX = useCallback(async () => {
    if (!isXAuthorized) {
      setPostError('Please authorize X first');
      return;
    }

    setIsPosting(true);
    setPostError(null);

    try {
      // First, download and upload the image if it exists
      let mediaId: string | undefined;
      
      if (generatedImageUrl) {
        try {
          console.log('Downloading generated image:', generatedImageUrl);
          const imageResponse = await fetch(generatedImageUrl);
          if (!imageResponse.ok) throw new Error('Failed to download image');
          
          const imageBlob = await imageResponse.blob();
          const formData = new FormData();
          formData.append('media', imageBlob, 'generated-image.png');

          console.log('Uploading image to X');
          const uploadResponse = await fetch('/api/upload-media', {
            method: 'POST',
            body: formData,
          });

          if (!uploadResponse.ok) throw new Error('Failed to upload image');

          const uploadData = await uploadResponse.json();
          if (uploadData.error) throw new Error(uploadData.error);
          
          mediaId = uploadData.mediaId;
          console.log('Image uploaded successfully, mediaId:', mediaId);
        } catch (imageError) {
          console.error('Error handling image:', imageError);
          setPostError('Failed to process image, but will attempt to post content');
        }
      }

      // Post to X with content and media
      console.log('Posting to X with content and mediaId:', { content: generatedContent, mediaId });
      const postResponse = await fetch('/api/x/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: generatedContent,
          mediaIds: mediaId ? [mediaId] : [],
        }),
      });

      if (!postResponse.ok) throw new Error('Failed to post to X');

      const postData = await postResponse.json();
      if (postData.error) throw new Error(postData.error);

      // Clear the form and generated content on success
      setFormData(prev => ({
        ...prev,
        title: "",
        topic: "",
        keywords: "",
        instructions: "",
        generateImage: false
      }));
      setGeneratedContent("");
      setGeneratedImageUrl(null);
      setCharCount(0);
      setAiSuggestions([]);
      setShowSuggestions(false);
      
      // Show success message
      setSuccessMessage('Posted successfully to X!');
    } catch (error) {
      console.error('Error posting to X:', error);
      setPostError(error instanceof Error ? error.message : 'Failed to post to X');
    } finally {
      setIsPosting(false);
    }
  }, [generatedContent, generatedImageUrl, isXAuthorized]);

  const toggleAdvancedSettings = useCallback(() => {
    setShowAdvancedSettings(prev => !prev);
  }, []);

  const handleDismissSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  return (
    <>
      {error && <ErrorNotification message={error} onClose={handleDismissError} />}
      {successMessage && <SuccessNotification message={successMessage} onClose={handleDismissSuccess} />}
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Form */}
                <div className="lg:col-span-1">
                  <div className="w-full">
                    <div className={`bg-background/20 backdrop-blur-sm border border-primary/10 rounded-xl p-6 ${showAdvancedSettings ? 'min-h-[1000px]' : 'min-h-[600px]'} transition-all duration-300`}>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Content Type - Moved to compact form */}
                        <div className="space-y-4">
                          <label className="block text-accent font-medium">Content Type</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {contentTypeOptions.map((option) => (
                              <div 
                                key={option.value} 
                                onClick={() => option.available && setFormData(prev => ({ ...prev, contentType: option.value }))}
                                className={`relative ${option.available ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                              >
                                <div 
                                  className={`text-center p-3 rounded-lg transition-all ${
                                    formData.contentType === option.value 
                                      ? 'bg-primary/20 border-2 border-primary/50' 
                                      : 'bg-background/30 border border-accent/10'
                                  }`}
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

                        {/* Main Content Input */}
                        <div className="space-y-4">
                          <label className="block text-accent font-medium">Content</label>
                          <textarea
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full h-32 bg-background/30 border border-accent/10 rounded-lg p-3 text-accent placeholder-accent/50 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                            placeholder="Enter your content here..."
                          />
                        </div>

                        {/* Advanced Settings Toggle */}
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                            className="text-accent/80 hover:text-accent flex items-center gap-2 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Advanced Settings
                          </button>
                          <button
                            type="submit"
                            disabled={isGenerating}
                            className="px-4 py-2 bg-primary text-background rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                          >
                            {isGenerating ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-4 h-4" />
                                Generate
                              </>
                            )}
                          </button>
                        </div>

                        {/* Advanced Settings */}
                        <div className={`space-y-4 transition-all duration-300 ease-in-out ${showAdvancedSettings ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                          {formData.contentType === "twitter" && (
                            <div className="space-y-4">
                              <label className="block text-accent font-medium">Post Template</label>
                              <div className="grid grid-cols-2 gap-3">
                                {["announcement", "question", "tip", "poll"].map((template) => (
                                  <div 
                                    key={template} 
                                    onClick={() => setFormData(prev => ({ ...prev, twitterTemplate: template }))}
                                    className={`cursor-pointer p-3 rounded-lg transition-all text-center capitalize ${
                                      formData.twitterTemplate === template 
                                        ? 'bg-primary/20 border-2 border-primary/50' 
                                        : 'bg-background/30 border border-accent/10'
                                    }`}
                                  >
                                    <span className="text-accent/80">{template}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Right Column - Preview */}
                <div className="lg:col-span-1">
                  <div className="bg-background/20 backdrop-blur-sm border border-primary/10 rounded-xl p-6 min-h-[600px]">
                    <h2 className="text-xl font-bold text-accent mb-4">Preview</h2>
                    <div className="space-y-4">
                      {/* Preview content will go here */}
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

// Add this to your global CSS or in a style tag
const styles = `
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
`; 