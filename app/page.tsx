"use client";

import { Spotlight } from "@/components/ui/spotlight";
import Link from "next/link";
import { ExpandableCardDemo } from "@/components/expandable-card-demo-grid";
import Image from "next/image";
import { MeteorEffect } from "@/components/aceternity/meteor-effect";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { AnimatedGradientText } from "@/components/aceternity/animated-gradient-text";
import { ParallaxScroll } from "@/components/aceternity/parallax-scroll";
import { HoverGlowEffect } from "@/components/aceternity/hover-glow-effect";
import { TextRevealCard } from "@/components/aceternity/text-reveal-card";
import { CardContainer, CardBody, CardItem } from "@/components/aceternity/3d-card";
import Layout from "@/components/Layout";
import { useWallet } from '@/contexts/WalletContext';
import { Sparkles } from "lucide-react";
import { teamMembers } from "@/utils/team-members";

export default function Home() {
  const { isConnected, connect, selectedPlan, selectPlan, hasBeeNFT, nftTier } = useWallet();

  const renderedPricingPlans = pricingPlans.map((plan, index) => {
    const isPlanSelected = selectedPlan === plan.name;
    const isPlanActive = hasBeeNFT && 
      ((nftTier === 'basic' && plan.name === 'Starter') || 
       (nftTier === 'pro' && plan.name === 'Professional') ||
       (nftTier === 'enterprise' && plan.name === 'Enterprise'));
    
    const canActivate = !plan.isComingSoon && !(hasBeeNFT && nftTier === 'pro' && plan.name === 'Starter');
    
    let buttonText = plan.buttonText;
    if (isPlanActive) {
      buttonText = "Active";
    } else if (hasBeeNFT && nftTier === 'pro' && plan.name === 'Starter') {
      buttonText = "Available";
    }
    
    const handlePlanClick = () => {
      if (plan.isComingSoon) return;
      
      if (hasBeeNFT) {
        // If already has any NFT, redirect to mint page
        window.location.href = '/mint';
      } else if (!isConnected) {
        // If not connected, connect wallet
        connect();
      } else {
        // Select the plan and redirect to mint page
        selectPlan(plan.name as 'Starter' | 'Professional' | 'Enterprise');
        window.location.href = '/mint';
      }
    };
    
    return (
      <div key={index} className="flex-1 max-w-sm mx-auto md:mx-0">
        <div className={`pricing-card relative bg-background/30 backdrop-blur-sm p-6 rounded-xl border ${
          isPlanActive ? 'border-primary' : 'border-accent/10'
        } h-full flex flex-col min-h-[460px]`}>
          {plan.isPopular && (
            <div className="absolute -top-3 inset-x-0">
              <div className="inline-block bg-primary text-background text-sm px-3 py-1 rounded-full font-medium">
                Most Popular
              </div>
            </div>
          )}
          <div className="mb-4">
            <h3 className="text-lg font-display text-primary mt-2">{plan.name}</h3>
            <div className="flex items-baseline mt-2">
              <span className="text-3xl font-bold text-accent">
                {plan.name === 'Starter' ? '0.1 SOL' : plan.name === 'Professional' ? '0.5 SOL' : plan.price}
              </span>
              {plan.period && <span className="ml-1 text-sm text-accent/70">{plan.period}</span>}
            </div>
            <p className="mt-2 text-sm text-accent/80">{plan.description}</p>
          </div>

          <div className="flex-grow">
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start">
                  <Sparkles className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-accent/90">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handlePlanClick}
            className={`w-full py-2 rounded-md text-center font-medium ${
              isPlanActive
                ? 'bg-primary text-background'
                : plan.isComingSoon
                ? 'bg-accent/20 text-accent/70 cursor-not-allowed'
                : !isConnected
                ? 'bg-primary/80 text-background hover:bg-primary transition-colors'
                : 'bg-primary/20 text-primary hover:bg-primary/30 transition-colors'
            }`}
            disabled={plan.isComingSoon}
          >
            {isPlanActive ? "Active" : plan.isComingSoon ? "Under Development" : !isConnected ? "Connect Wallet" : buttonText}
          </button>
        </div>
      </div>
    );
  });

  return (
    <Layout>
    <div className="bg-background text-accent">
      {/* Hero Section with Aurora Background and Meteor Effect - Extended by 30% height */}
      <AuroraBackground 
        position={{ x: 50, y: 50 }}
        primaryColor="hsl(47, 100%, 50%)"
        secondaryColor="hsl(0, 0%, 80%)"
        className="relative z-0"
      >
        <section className="pt-20 pb-16 md:pb-32 relative">
          <MeteorEffect count={25} color="#f9b72d" className="z-0" />
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 mb-8 md:mb-0 relative text-center md:text-left">
                <div className="relative">
                  <Spotlight
                    className="-top-40 left-0 md:left-96 md:-top-50 h-[1000%] w-[100%] md:w-[700%] lg:w-[100%]"
                    fill="#ffffff"
                  />
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-display mb-4 md:mb-6 leading-tight">
                    Craft Content with <AnimatedGradientText text="AI Precision" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display" />
                  </h1>
                </div>
                <div className="mb-4 md:mb-6">
                  <AnimatedGradientText 
                    text="Let the bees build your buzz" 
                    className="text-xl sm:text-2xl md:text-3xl font-display italic"
                  />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-2xl font-display mb-4 md:mb-6 text-accent animate-fade-in">
                  Elevate Every Word, Every Message
                </h2>
                <p className="text-base sm:text-lg mb-6 md:mb-8 text-accent/80 max-w-lg mx-auto md:mx-0 animate-reveal">
                  Dive into the future of content creation. Harness the power of artificial intelligence to craft messages that resonate, engage, and convert.
                </p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <Link 
                    href="/chat" 
                    className="w-full sm:w-auto bg-[#f9b72d] text-[#000000] font-medium px-6 py-3 rounded-md transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
                  >
                    Take Your Journey Today
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 relative">
                <div className="w-full relative px-4 md:px-0">
                  <div className="relative aspect-square md:aspect-[4/3] lg:aspect-[3/2] max-w-[600px] mx-auto flex items-center justify-center">
                    <div className="relative w-[200%] h-[200%]">
                      <Image
                        src="/images/hero-banner.png"
                        alt="Friendly cartoon bees illustration"
                        fill
                        priority
                        className="object-contain animate-bee-float scale-[5] bee-glow"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                        quality={100}
                        unoptimized
                      />
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                    <div className="absolute w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute right-0 bottom-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AuroraBackground>
      
      {/* Features Section with Expandable Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display mb-12 text-center">
            <AnimatedGradientText text="Key Features of Our AI Content Platform" />
          </h2>
          <ExpandableCardDemo />
        </div>
      </section>
      
      {/* AI Agents Section */}
      <section className="py-16 bg-primary/5 relative">
        <MeteorEffect count={10} color="#f9b72d" className="z-0" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-display mb-12 text-center">
            <AnimatedGradientText text="Meet Our AI Agents" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-background/20 backdrop-blur-sm border border-primary/10 rounded-xl p-6 hover:border-primary/30 transition-colors cursor-pointer hover:shadow-md hover:shadow-primary/10 group"
                onClick={() => {
                  window.location.href = `/team?agent=${encodeURIComponent(member.name)}`;
                }}
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
                  <span className="text-xs text-primary/60 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">Click for details</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link 
              href="/team" 
              className="px-6 py-3 bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors inline-flex items-center group"
            >
              <span>Learn more about our AI agents</span>
              <svg 
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Mastery Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <HoverGlowEffect>
                <CardContainer>
                  <CardBody className="bg-transparent border-0">
                    <CardItem translateZ={50} className="w-full rounded-xl overflow-hidden">
                      <Image 
                        src="/images/ai-dashboard.jpg" 
                        alt="AI Dashboard" 
                        width={800}
                        height={500}
                        className="w-full h-auto"
                        unoptimized
                      />
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </HoverGlowEffect>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-display mb-4 text-primary">
                <AnimatedGradientText text="From Data to Dialogue: AI-Driven Mastery" />
              </h2>
              <p className="text-lg text-accent/80 mb-6 animate-fade-in">
                Witness the transformative power of AI. Watch as complex data becomes intuitive insights, empowering your decisions and elevating your storytelling abilities to new levels.
              </p>
              
              <div className="mt-8">
                <div className="inline-block mb-3">
                  <div className="px-4 py-2 bg-background text-primary flex items-center space-x-2 rounded-md">
                    <span className="text-xl">✓</span>
                    <span>Advanced content analytics</span>
                  </div>
                </div>
                
                <div className="inline-block mb-3 ml-4">
                  <div className="px-4 py-2 bg-background text-primary flex items-center space-x-2 rounded-md">
                    <span className="text-xl">✓</span>
                    <span>Real-time insights</span>
                  </div>
                </div>
                
                <div className="inline-block">
                  <div className="px-4 py-2 bg-background text-primary flex items-center space-x-2 rounded-md">
                    <span className="text-xl">✓</span>
                    <span>Intuitive visualization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section with Parallax Scroll */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display mb-12 text-center">
            <AnimatedGradientText text="Voices from Our Satisfied Customers" />
          </h2>
          <ParallaxScroll className="gap-8 py-4">
            {testimonials.map((testimonial, index) => (
              <HoverGlowEffect key={index} containerClassName="min-w-[350px] max-w-[350px]">
                <div className="bg-background/20 p-6 rounded-xl backdrop-blur-sm border border-accent/10 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      <span role="img" aria-label="User">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-accent">{testimonial.name}</h3>
                      <p className="text-xs text-accent/70">{testimonial.title}</p>
                    </div>
                  </div>
                  <p className="text-accent/80 text-sm break-words whitespace-normal">{testimonial.quote}</p>
                </div>
              </HoverGlowEffect>
            ))}
          </ParallaxScroll>
        </div>
      </section>
      
      {/* Team Collaboration Section */}
      <section className="py-16 bg-background relative overflow-hidden">
        <MeteorEffect count={8} color="#f9b72d" className="z-0" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-10">
            <div className="md:w-1/2">
              <HoverGlowEffect>
                <CardContainer>
                  <CardBody className="bg-transparent border-0">
                    <CardItem translateZ={50} className="w-full rounded-xl overflow-hidden">
                      <Image 
                        src="/images/team-collaboration.jpg" 
                        alt="Team Collaboration" 
                        width={800}
                        height={500}
                        className="w-full h-auto"
                      />
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </HoverGlowEffect>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-display mb-4 text-primary">
                <AnimatedGradientText text="Seamless Team Collaboration" />
              </h2>
              <p className="text-lg text-accent/80 mb-6 animate-fade-in">
                Enhance your team&apos;s productivity with our collaborative tools. Share templates, provide feedback, and work together in real-time to create exceptional content.
              </p>
              
              <TextRevealCard
                text="Unlock Team Potential"
                revealText="Scale Your Content Creation"
                className="max-w-md text-xl font-semibold mt-8"
                revealClassName="text-primary font-bold"
              >
                <p className="text-accent/80 text-sm mt-2">
                  Our enterprise features enable teams of any size to streamline their content creation process and maintain consistent brand voice across all channels.
                </p>
              </TextRevealCard>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 relative overflow-hidden">
        <div className="container px-4 mx-auto relative z-10">
          <div className="text-center mb-12">
            <AnimatedGradientText text="Pricing Plans for Every Need" />
            <p className="mt-4 text-accent/80 max-w-2xl mx-auto">
              Purchase an NFT subscription to unlock premium features. Your NFT grants permanent access to the corresponding tier's benefits.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            {renderedPricingPlans}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 relative">
        <MeteorEffect count={15} color="#f9b72d" className="z-0" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display mb-6">
              <AnimatedGradientText text="Ready to Transform Your Content Creation?" />
            </h2>
            <p className="text-lg text-accent/80 max-w-2xl mx-auto mb-8 animate-reveal">
              Join thousands of content creators and businesses who are leveraging the power of AI to boost their content strategy.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
              <HoverGlowEffect containerClassName="w-full md:w-auto">
                <CardContainer className="w-full py-0">
                  <CardBody className="bg-transparent w-full py-0">
                    <CardItem translateZ={20} className="w-full">
                      <div className="bg-accent/5 backdrop-blur-sm border border-accent/10 rounded-lg p-4 text-left">
                        <h3 className="text-xl font-semibold text-primary mb-2">Unlimited Creativity</h3>
                        <p className="text-accent/80 text-sm">Generate content across multiple formats and channels with no limitations.</p>
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </HoverGlowEffect>
              
              <HoverGlowEffect containerClassName="w-full md:w-auto">
                <CardContainer className="w-full py-0">
                  <CardBody className="bg-transparent w-full py-0">
                    <CardItem translateZ={20} className="w-full">
                      <div className="bg-accent/5 backdrop-blur-sm border border-accent/10 rounded-lg p-4 text-left">
                        <h3 className="text-xl font-semibold text-primary mb-2">24/7 Availability</h3>
                        <p className="text-accent/80 text-sm">Your AI writing assistant is always ready to help, whenever inspiration strikes.</p>
                      </div>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </HoverGlowEffect>
            </div>
            
            {/* Platform Features */}
            <div className="mb-10 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-primary mb-4">Platforms We Support</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-accent/5 backdrop-blur-sm border border-accent/10 rounded-lg p-4 text-left">
                  <h4 className="font-semibold text-accent mb-2">Available Now</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-primary mr-2">✓</span>
                      <span className="text-accent/80 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        X (Twitter) AI Content Generation
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary mr-2">✓</span>
                      <span className="text-accent/80 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm3.5 13.5l-1 1c-.3.3-.7.5-1.2.5s-.9-.2-1.2-.5l-1-1c-.3-.3-.5-.7-.5-1.2s.2-.9.5-1.2l1-1c.3-.3.7-.5 1.2-.5s.9.2 1.2.5l1 1c.3.3.5.7.5 1.2s-.2.9-.5 1.2zM12 6c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                        </svg>
                        Scheduled Posting
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="bg-accent/5 backdrop-blur-sm border border-accent/10 rounded-lg p-4 text-left">
                  <h4 className="font-semibold text-accent mb-2">Coming Soon</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <span className="text-primary/70 mr-2">→</span>
                      <span className="text-accent/80 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.04.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.053-.059 1.37-.059 4.04 0 2.668.01 2.985.059 4.038.044.976.207 1.505.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.059 4.04.059 2.668 0 2.985-.01 4.039-.059.976-.044 1.504-.207 1.858-.344.465-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.054.059-1.37.059-4.039 0-2.67-.01-2.987-.059-4.04-.044-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.059-4.04-.059zm0 3.064A5.135 5.135 0 0 1 17.135 12 5.135 5.135 0 0 1 12 17.135 5.135 5.135 0 0 1 6.865 12 5.135 5.135 0 0 1 12 6.865zm0 1.802a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666zm5.338-3.205a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z" />
                        </svg>
                        Instagram Integration
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary/70 mr-2">→</span>
                      <span className="text-accent/80 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        Facebook Integration
                      </span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-primary/70 mr-2">→</span>
                      <span className="text-accent/80 text-sm flex items-center">
                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                        </svg>
                        TikTok Integration
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <Link 
              href="/chat" 
              className="px-8 py-4 bg-[#f9b72d] text-[#000000] rounded-md hover:bg-[#f9b72d]/90 transition-colors font-medium text-lg inline-block"
            >
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
    </Layout>
  );
}

const testimonials = [
  {
    avatar: "👩‍💼",
    name: "Sarah Johnson",
    title: "Marketing Director",
    quote: "AutonoBee has completely transformed how our team creates content. I'm genuinely amazed at how it's cut our production time in half while improving quality. The AI understands our brand voice perfectly - I couldn't imagine going back to our old process!"
  },
  {
    avatar: "👨‍🚀",
    name: "Michael Lee",
    title: "Startup Founder",
    quote: "Finding AutonoBee was the turning point for our content strategy. With limited resources, we now produce enterprise-quality content that connects deeply with our audience. I'm honestly blown away by how it's accelerated our growth. Worth every penny and more!"
  },
  {
    avatar: "👩‍💻",
    name: "Jennifer Kim",
    title: "Digital Marketer",
    quote: "I can't thank the AutonoBee team enough! Their platform increased our engagement by 68% and cut our content creation costs by a third. The analytics are so insightful that we've completely redesigned our strategy based on them. This tool is absolutely indispensable."
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "0.1 SOL",
    period: "one-time",
    description: "Perfect for creators just beginning their journey",
    features: [
      "500 AI-powered posts per month",
      "Smart caption generator for X",
      "Viral hashtag recommendations",
      "Post scheduling (up to 7 days)",
      "Real-time engagement analytics"
    ],
    buttonText: "Get Started",
    isPopular: false,
    isComingSoon: false
  },
  {
    name: "Professional",
    price: "0.5 SOL",
    period: "one-time",
    description: "Elevate your social presence to the next level",
    features: [
      "Unlimited AI-powered content creation",
      "Advanced audience sentiment analysis",
      "Competitor content insights",
      "Unlimited post scheduling",
      "Engagement-optimized posting times",
      "Trend prediction & content suggestions"
    ],
    buttonText: "Upgrade Now",
    isPopular: true,
    isComingSoon: false
  },
  {
    name: "Enterprise",
    price: "Coming Soon",
    period: "",
    description: "Complete solution for teams and agencies",
    features: [
      "Everything in Professional",
      "Multi-user collaboration workspace",
      "Brand voice customization",
      "AI trained on your highest-performing content",
      "Advanced ROI & conversion tracking",
      "Dedicated success manager"
    ],
    buttonText: "Under Development",
    isPopular: false,
    isComingSoon: true
  }
];
