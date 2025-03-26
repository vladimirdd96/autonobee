"use client";

import Layout from "@/components/Layout";
import { Shield, Lock, Eye, Server } from 'lucide-react';

export default function Privacy() {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display text-accent mb-8">Privacy Policy</h1>
          
          <div className="space-y-8">
            {/* Introduction */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display text-accent mb-4">Introduction</h2>
                  <p className="text-accent/80 leading-relaxed">
                    At AutonoBee, we take your privacy seriously. This Privacy Policy explains how we collect, 
                    use, and protect your personal information when you use our platform.
                  </p>
                </div>
              </div>
            </section>

            {/* Data Collection */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display text-accent mb-4">Information We Collect</h2>
                  <ul className="list-disc list-inside text-accent/80 space-y-2">
                    <li>Account information (name, email, X account details)</li>
                    <li>Content you create or upload to our platform</li>
                    <li>Usage data and analytics</li>
                    <li>Communication preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Server className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display text-accent mb-4">How We Use Your Information</h2>
                  <ul className="list-disc list-inside text-accent/80 space-y-2">
                    <li>To provide and improve our services</li>
                    <li>To personalize your experience</li>
                    <li>To communicate with you about our services</li>
                    <li>To analyze and optimize platform performance</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display text-accent mb-4">Data Protection</h2>
                  <p className="text-accent/80 leading-relaxed">
                    We implement industry-standard security measures to protect your data, including:
                  </p>
                  <ul className="list-disc list-inside text-accent/80 space-y-2 mt-4">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security audits and updates</li>
                    <li>Access controls and authentication</li>
                    <li>Secure data storage and backup systems</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <h2 className="text-2xl font-display text-accent mb-4">Your Rights</h2>
              <p className="text-accent/80 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-accent/80 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data</li>
              </ul>
            </section>

            {/* Contact */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <h2 className="text-2xl font-display text-accent mb-4">Contact Us</h2>
              <p className="text-accent/80 leading-relaxed">
                If you have any questions about our Privacy Policy or how we handle your data, 
                please contact us at privacy@autonobee.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
} 