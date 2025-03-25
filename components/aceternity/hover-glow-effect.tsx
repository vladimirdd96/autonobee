"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const HoverGlowEffect = ({
  children,
  className,
  containerClassName,
  glowColor = "rgba(249, 183, 45, 0.3)",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  glowColor?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("relative group", containerClassName)}
      initial={false}
      animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 blur transition duration-500"
        style={{
          background: `linear-gradient(to right, ${glowColor}, ${glowColor}50, ${glowColor}25)`,
        }}
        initial={false}
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
      />
      <div className={cn("relative", className)}>
        {children}
      </div>
    </motion.div>
  );
}; 