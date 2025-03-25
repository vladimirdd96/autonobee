"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Sparkles, Search, Rocket, RefreshCw, BarChart3, Globe } from "lucide-react";

export function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.05 },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-accent/20 backdrop-blur-sm rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-background dark:bg-background sm:rounded-3xl overflow-hidden border border-accent/10"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <div className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    {active.icon && <active.icon className="w-8 h-8 text-primary" />}
                  </div>
                </div>
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium text-primary text-base"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-accent text-base"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-accent/80 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-6">
        {cards.map((card) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={card.title}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col bg-background rounded-xl cursor-pointer border border-accent/10 h-full group relative overflow-hidden"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            {/* Animated background gradient on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              initial={false}
              whileHover={{ 
                opacity: 1,
                transition: { duration: 0.3 }
              }}
            />

            <div className="flex gap-4 flex-col w-full h-full relative">
              <motion.div 
                layoutId={`image-${card.title}-${id}`} 
                className="aspect-video group-hover:scale-[1.02] transition-transform duration-500"
              >
                <div className="w-full h-40 rounded-lg bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/20 transition-colors duration-500">
                  <motion.div 
                    className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center"
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {card.icon && (
                      <motion.div
                        initial={{ rotate: 0 }}
                        whileHover={{ 
                          rotate: 5,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <card.icon className="w-6 h-6 text-primary" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
              <motion.div 
                className="flex justify-center items-center flex-col flex-grow"
                whileHover={{ y: -2 }}
              >
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-primary text-center md:text-left text-base group-hover:text-primary/90 transition-colors"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-accent text-center md:text-left text-base mt-1 group-hover:text-accent/90 transition-colors"
                >
                  {card.description}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "AI-Powered Writing Tool",
    title: "AI Writing Assistant",
    icon: Sparkles,
    ctaText: "Learn More",
    ctaLink: "/generate",
    content: () => {
      return (
        <p>
          Our AI Writing Assistant is a cutting-edge tool designed to enhance your writing experience. Powered by advanced language models, it adapts to your unique tone and style to create compelling content. <br /> <br /> 
          Whether you need help drafting emails, creating marketing copy, or writing blog posts, our assistant provides real-time suggestions and complete drafts that sound authentically like you. With features like tone adjustment, language refinement, and style customization, you&apos;ll produce better content in less time.
        </p>
      );
    },
  },
  {
    description: "In-depth Content Metrics",
    title: "Content Analysis",
    icon: Search,
    ctaText: "Learn More",
    ctaLink: "/dashboard",
    content: () => {
      return (
        <p>
          Gain deep insights into your content&apos;s performance with our comprehensive Content Analysis tool. Understand what resonates with your audience through detailed metrics and actionable feedback. <br /> <br /> 
          Our analysis covers readability scores, engagement predictions, sentiment analysis, and target audience alignment. The intuitive dashboard highlights areas for improvement while tracking progress over time. Make data-driven decisions to continuously improve your content strategy and maximize impact.
        </p>
      );
    },
  },
  {
    description: "Streamline Your Workflow",
    title: "Smart Automation",
    icon: Rocket,
    ctaText: "Learn More",
    ctaLink: "/dashboard",
    content: () => {
      return (
        <p>
          Reclaim valuable time with our Smart Automation tools designed to handle repetitive content tasks. Set up intelligent workflows that automatically generate, schedule, and distribute your content. <br /> <br /> 
          Create custom templates for recurring content needs, establish publishing schedules, and let the system handle the execution. With features like batch processing, conditional logic, and integration with major platforms, you can focus on strategy while the system handles implementation.
        </p>
      );
    },
  },
  {
    description: "Multiple Content Formats",
    title: "Content Repurposing",
    icon: RefreshCw,
    ctaText: "Learn More",
    ctaLink: "/generate",
    content: () => {
      return (
        <p>
          Maximize the value of your existing content by transforming it into multiple formats with our Content Repurposing tool. Turn blog posts into social media snippets, videos into article series, or research into infographics with minimal effort. <br /> <br /> 
          Our AI analyzes your original content to identify the most impactful elements and restructures it for different platforms and audiences. This approach ensures consistent messaging across channels while optimizing each piece for its specific medium and audience.
        </p>
      );
    },
  },
  {
    description: "Rank Higher, Reach Further",
    title: "SEO Optimization",
    icon: BarChart3,
    ctaText: "Learn More",
    ctaLink: "/dashboard",
    content: () => {
      return (
        <p>
          Ensure your content ranks well in search results with our integrated SEO Optimization tools. From keyword research to on-page optimization recommendations, we provide everything you need to improve visibility. <br /> <br /> 
          The system analyzes your content against top-performing competitors, identifies keyword opportunities, and suggests specific improvements to enhance search engine performance. Real-time feedback during the writing process ensures you create content that&apos;s both engaging for readers and optimized for search algorithms.
        </p>
      );
    },
  },
  {
    description: "Content for Every Platform",
    title: "Multi-Platform Support",
    icon: Globe,
    ctaText: "Learn More",
    ctaLink: "/generate",
    content: () => {
      return (
        <p>
          Create content optimized for any platform with our Multi-Platform Support feature. Whether you&apos;re targeting social media, blogs, newsletters, or e-commerce platforms, our tools ensure your content is perfectly formatted and tailored for each channel. <br /> <br /> 
          The system automatically adjusts content length, tone, formatting, and calls-to-action based on platform best practices. Preview how your content will appear on different platforms before publishing, and track performance across channels from a single dashboard.
        </p>
      );
    },
  },
];
