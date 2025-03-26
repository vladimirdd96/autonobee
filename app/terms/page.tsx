"use client";

import Layout from "@/components/Layout";
import { Scale, FileText, AlertCircle, CheckCircle } from 'lucide-react';

export default function Terms() {
  return (
    <Layout>
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display text-accent mb-8">Terms and Conditions</h1>
          
          <div className="space-y-8">
            {/* Introduction */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Scale className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display text-accent mb-4">Agreement to Terms</h2>
                  <p className="text-accent/80 leading-relaxed">
                    By accessing or using AutonoBee, you agree to be bound by these Terms and Conditions. 
                    If you disagree with any part of these terms, you may not access our service.
                  </p>
                </div>
              </div>
            </section>

            {/* Service Description */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display text-accent mb-4">Service Description</h2>
                  <p className="text-accent/80 leading-relaxed">
                    AutonoBee provides an AI-powered content creation platform that helps users generate, 
                    edit, and optimize content. Our service includes:
                  </p>
                  <ul className="list-disc list-inside text-accent/80 space-y-2 mt-4">
                    <li>Content generation and editing tools</li>
                    <li>AI-powered content suggestions</li>
                    <li>Content analytics and optimization</li>
                    <li>Integration with X (Twitter) platform</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display text-accent mb-4">User Responsibilities</h2>
                  <p className="text-accent/80 leading-relaxed mb-4">
                    As a user of AutonoBee, you agree to:
                  </p>
                  <ul className="list-disc list-inside text-accent/80 space-y-2">
                    <li>Provide accurate account information</li>
                    <li>Maintain the security of your account</li>
                    <li>Not use the service for any illegal purposes</li>
                    <li>Not attempt to reverse engineer the service</li>
                    <li>Not use the service to generate harmful or misleading content</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <h2 className="text-2xl font-display text-accent mb-4">Intellectual Property</h2>
              <p className="text-accent/80 leading-relaxed mb-4">
                The service and its original content, features, and functionality are owned by AutonoBee 
                and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-accent/80 leading-relaxed">
                Content generated using our service remains the property of the user who created it, 
                subject to our terms of service and applicable laws.
              </p>
            </section>

            {/* Service Modifications */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <h2 className="text-2xl font-display text-accent mb-4">Service Modifications</h2>
              <p className="text-accent/80 leading-relaxed">
                We reserve the right to modify or discontinue our service at any time, with or without 
                notice. We shall not be liable to you or any third party for any modification, 
                suspension, or discontinuance of the service.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <h2 className="text-2xl font-display text-accent mb-4">Limitation of Liability</h2>
              <p className="text-accent/80 leading-relaxed">
                In no event shall AutonoBee be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <h2 className="text-2xl font-display text-accent mb-4">Changes to Terms</h2>
              <p className="text-accent/80 leading-relaxed">
                We reserve the right to update or change our Terms and Conditions at any time. We will 
                notify you of any changes by posting the new Terms and Conditions on this page.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-background/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display text-accent mb-4">Contact Us</h2>
                  <p className="text-accent/80 leading-relaxed">
                    If you have any questions about these Terms and Conditions, please contact us at 
                    legal@autonobee.com
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
} 