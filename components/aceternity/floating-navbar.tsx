"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface NavItem {
  name: string;
  link: string;
}

export function FloatingNavbar({
  navItems,
  className,
}: {
  navItems: NavItem[];
  className?: string;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "relative z-50",
          className
        )}
      >
        <motion.div
          className={cn(
            "flex items-center justify-center space-x-2 rounded-full p-2 backdrop-blur-md transition-all",
            isScrolled ? 
              "bg-background/70 border border-primary/20 shadow-md shadow-primary/10" : 
              "bg-background/40 border border-accent/10"
          )}
        >
          {navItems.map((item) => (
            <Link href={item.link} key={item.name} className="relative px-3 py-2 rounded-full">
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-full",
                  (pathname === item.link || 
                   (item.link === '/dashboard' && (
                     pathname?.startsWith('/dashboard') || 
                     pathname?.startsWith('/content-creation') || 
                     pathname?.startsWith('/chat') || 
                     pathname?.startsWith('/analytics') || 
                     pathname?.startsWith('/trends') || 
                     pathname?.startsWith('/team') || 
                     pathname?.startsWith('/settings')
                   ))) 
                    ? "bg-primary/20 text-white" 
                    : "text-accent hover:text-white"
                )}
                layoutId="navbar-indicator"
                transition={{
                  type: "spring",
                  duration: 0.6,
                  bounce: 0.2,
                }}
                style={{ opacity: (pathname === item.link || 
                  (item.link === '/dashboard' && (
                    pathname?.startsWith('/dashboard') || 
                    pathname?.startsWith('/content-creation') || 
                    pathname?.startsWith('/chat') || 
                    pathname?.startsWith('/analytics') || 
                    pathname?.startsWith('/trends') || 
                    pathname?.startsWith('/team') || 
                    pathname?.startsWith('/settings')
                  ))) ? 1 : 0 }}
              />
              <span className="relative z-10 text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 