"use client";
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
  revealClassName,
}: {
  text: string;
  revealText: string;
  children?: React.ReactNode;
  className?: string;
  revealClassName?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-fit h-fit cursor-pointer rounded-lg p-2",
        className
      )}
    >
      <div className="relative">
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 0 : 1,
            y: isHovered ? -20 : 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="text-accent"
        >
          {text}
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 20,
          }}
          transition={{
            duration: 0.2,
          }}
          className={cn(
            "absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/70 to-primary/50",
            revealClassName
          )}
        >
          {revealText}
        </motion.div>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}; 