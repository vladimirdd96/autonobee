"use client";

import Layout from "@/components/Layout";
import { Sparkles, Brain, Zap, Target, Shield } from 'lucide-react';

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display text-accent mb-8">About AutonoBee</h1>
          
          {/* Hero Section */}
          <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-8 mb-12">
            <div className="flex items-start gap-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-display text-accent mb-4">Revolutionizing Content Creation</h2>
                <p className="text-accent/80 leading-relaxed text-lg">
                  AutonoBee is powered by a state-of-the-art AI system, specifically trained on an extensive dataset 
                  of high-quality content across various industries and formats. Our AI has been fine-tuned to 
                  understand the nuances of content creation, making it the most sophisticated content assistant 
                  available today.
                </p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display text-accent mb-2">Advanced AI Technology</h3>
                  <p className="text-accent/80">
                    Our AI system has been trained on billions of content pieces, making it an expert in 
                    understanding context, tone, and audience engagement.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display text-accent mb-2">Lightning Fast</h3>
                  <p className="text-accent/80">
                    Get instant feedback and suggestions to streamline your content creation process and 
                    boost productivity.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display text-accent mb-2">Precision Focused</h3>
                  <p className="text-accent/80">
                    Specialized in content creation, our AI provides targeted suggestions and improvements 
                    that matter for your specific needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-display text-accent mb-2">Enterprise Ready</h3>
                  <p className="text-accent/80">
                    Built with security and scalability in mind, making it perfect for both individual 
                    creators and large organizations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-8">
            <h2 className="text-2xl font-display text-accent mb-4">Our Mission</h2>
            <p className="text-accent/80 leading-relaxed text-lg">
              At AutonoBee, we're on a mission to transform the way content is created. By combining 
              cutting-edge AI technology with deep content expertise, we're helping creators and 
              businesses produce exceptional content that resonates with their audience and drives results.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
} 